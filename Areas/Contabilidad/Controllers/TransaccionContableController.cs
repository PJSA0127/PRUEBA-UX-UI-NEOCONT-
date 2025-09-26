using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PRUEBA_UX_UI__NEOCONT_.Areas.Contabilidad.Controllers
{
    public class TransaccionContableController : Controller
    {

        public ActionResult IngresoAsientosContablesManuales()
        {
            ViewBag.Title = "Ingreso de Asientos Contables Manuales";
            ViewBag.Message = "IngresoAsientosContablesManuales";
            return View();
        }

        public ActionResult SolicitudIngresoAsientoOperativos()
        {
            ViewBag.Message = "SolicitudIngresoAsientoOperativos";
            return View();
        }
    }
}
