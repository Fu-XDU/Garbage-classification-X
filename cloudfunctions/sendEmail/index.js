const cloud = require('wx-server-sdk')
cloud.init()
//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com', //网易163邮箱 smtp.163.com
  port: 465, //网易邮箱端口 25
  auth: {
    user: '1318748421@qq.com', //邮箱账号
    pass: 'oaqycekppjuuifej' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async (event, context) => {
  // 创建一个邮件对象
  var mail = {
    // 发件人
    from: '1318748421@qq.com',//此处必须有邮件发出者的邮箱
    // 主题
    subject: '微信小程序意见反馈',
    // 收件人
    to: '1317283242@qq.com',
    // 邮件内容，text或者html格式
    text: event.feedbackContent + '\n' + event.emailContent//可以是链接，也可以是验证码
  };
  let res = await transporter.sendMail(mail);
  return res;
}