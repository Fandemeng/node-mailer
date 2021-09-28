const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config(); //使用环境变量

const User = require("./models/User");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//连接数据库connect mongodb
mongoose.connect("mongodb+srv://taowei:test1234@fandatabase.hrps0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
    res.json({ state: 'suc', msg: 'it works' });
});

//新建post请求,存储用户数据
app.post('/addUser', (req, res) => {
    // console.log(req.body);
    User.findOne({ username: req.body.username }).then(user => {
        if (user) {
            res.status(400).json({
                state: 'failed',
                msg: '该用户已存在'
            });
        } else {
            const newUser = new User({
                username: req.body.username,
                pwd: req.body.pwd,
                email: req.body.email
            });

            newUser.save().then(user => {
                res.status(200).json({
                    state: "suc",
                    msg: "添加用户成功",
                    data: user
                });
            }).catch(err => console.log(err));
        }
    })
});
// 找回密码
app.post("/retrievePwd", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
        if (!user) {
            res.status(400).json({
                state: 'failed',
                msg: '该用户不存在'
            });
        } else {
            //第一步，配置发邮件信息
            let transporter = nodemailer.createTransport({
                service: "qq",
                secure: true,
                auth: {
                    // user: "processs.env.EMAIL", //925492022@qq.com
                    // pass: "processs.env.PASSWORD" //123456
                    user: "925492022@qq.com",
                    pass: "kuxgyqlpjpccbbda"
                }
            });

            //第二步，配置发送信息
            let mailOptions = {
                from: "925492022@qq.com",
                to: req.body.email,
                subject: "找回密码",
                text: `您的用户名:${user.username},密码:${user.pwd}`
            }

            //第三步，发送
            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    res.status(400).json({
                        state: 'failed',
                        msg: err
                    })
                } else {
                    res.status(200).json({
                        state: "suc",
                        msg: `密码已发送至您的邮箱${req.body.email}`
                    });
                }

            })
        }
    });
});



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`服务正在运行中，端口：${port}`)
})