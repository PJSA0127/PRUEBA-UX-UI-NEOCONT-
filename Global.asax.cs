using PRUEBA_UX_UI__NEOCONT_.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace PRUEBA_UX_UI__NEOCONT_
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            BundleTable.EnableOptimizations = true;
            BundleTable.Bundles.UseCdn = true;
        }

        protected void Application_Error()
        {
            var exception = Server.GetLastError();
            Response.Clear();

            var httpException = exception as HttpException;
            var routeData = new RouteData();
            routeData.Values["controller"] = "Shared";

            if (httpException != null)
            {
                switch (httpException.GetHttpCode())
                {
                    case 404:
                        routeData.Values["action"] = "NotFound";
                        break;
                    case 500:
                        routeData.Values["action"] = "Error";
                        break;
                    default:
                        routeData.Values["action"] = "Error";
                        break;
                }
            }
            else
            {
                routeData.Values["action"] = "Error";
            }

            Server.ClearError();
            IController controller = new SharedController();
            controller.Execute(new RequestContext(new HttpContextWrapper(Context), routeData));
        }

    }
}
