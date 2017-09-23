export default {
  right: '/topic/5433d5e4e737cbe96dcef312', // 正确路径
  error: '/topc/5433d5e4e737cbe96dcef312', // url错误
  backEnd: '/topic/5433d5e4e737cbe96dcef31', // 参数错误
  regist: '/yibai-web/user/regist', // 注册
  regist1: '/demo/?service=User.userReg', // 注册1
  login: '/yibai-web/user/login', // 登录
  usermessage: '/yibai-web/user/', // 保存 修改
  logout: '/yibai-web/user/logout', // 退出登录
  codeLogin: '/yibai-web/user/weixin/wxOauthCallback', // 微信登陆code
  weipay: '/yibai-web/pay/wxUnifiedorder', // 微信支付,
  createProgram: '/cms/v1/createProgram', // 创建视频
  generatetoken: '/vms/v1/user/generatetoken?uid=chengyaming&cpid=ebai', // token
  getuploadurl: '/vms/v1/asset/getuploadurl?isDrm=false', // 获取视频上传地址，  fileKey
  queryProgram: '/cms/v1/queryProgram?cpID=cpid001&userID=user001&pageNum=2&pageSize=10'// 查询视频列表
}
