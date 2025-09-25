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
            ViewBag.Message = "IngresoAsientosContablesManuales";
            return View();
        }

        public ActionResult SolicitudIngresoAsientoOperativos()
        {
            ViewBag.Message = "SolicitudIngresoAsientoOperativos";
            return View();
        }

        //public ActionResult IngresoAsientosContablesManuales()
        //{
        //    try
        //    {
        //        // Ejemplo de lógica
        //        var datos = ObtenerDatos();
        //        if (datos == null)
        //        {
        //            throw new Exception("No se encontraron datos para mostrar.");
        //        }

        //        return View(datos);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Registrar el error (ej: log a archivo o base de datos)
        //        System.Diagnostics.Debug.WriteLine(ex);

        //        // Mandar un mensaje controlado a la vista de Error
        //        ViewBag.ErrorMessage = ex.Message;
        //        return View("~/Views/Shared/Error.cshtml");
        //    }
        //}
    }
}
