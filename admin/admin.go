package admin

import (
  "fmt"
  "strconv"
  "gopkg.in/kataras/iris.v6"
  "gopkg.in/kataras/iris.v6/adaptors/httprouter"
  "github.com/alsmile/goMicroServer/utils"
  "github.com/alsmile/goMicroServer/admin/controllers"
)

func Start() {
  app := iris.New()
  app.Adapt(httprouter.New())
  app.StaticWeb("/assets", "./admin/web/dist/assets")

  app.Get("/", controllers.Index)
  app.Get("/browser.html", controllers.Browser)
  app.Get("/captcha", controllers.Captcha)

  app.Post("/api/login", controllers.Login)
  app.Post("/api/signup", controllers.SignUp)
  app.Post("/api/sign/active", controllers.SignActive)
  app.Post("/api/forget/password", controllers.ForgetPassword)
  app.Post("/api/sign/new/password", controllers.NewPassword)
  app.Get("/api/user/info", controllers.UserInfo)

  app.Get("/api/sign/config", controllers.GetSignConfig)

  fmt.Printf("[log]Admin listen: %s:%d\r\n", utils.GlobalConfig.Admin.Host, utils.GlobalConfig.Admin.Port)
  strPort := strconv.Itoa(int(utils.GlobalConfig.Admin.Port))
  app.Listen(utils.GlobalConfig.Admin.Host + ":" + strPort)
}
