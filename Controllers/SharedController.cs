using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PRUEBA_UX_UI__NEOCONT_.Controllers
{
    public class SharedController : Controller
    {
        public ActionResult Placeholder()
        {
            return View();
        }

        public ActionResult Error()
        {
            ViewBag.Title = "Error del sistema";
            return View();
        }

        public ActionResult NotFound()
        {
            ViewBag.Title = "Página no encontrada";
            return View();
        }
    }
}