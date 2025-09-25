using System.Web.Mvc;

namespace PRUEBA_UX_UI__NEOCONT_.Areas.Contabilidad
{
    public class ContabilidadAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Contabilidad";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Contabilidad_default",
                "Contabilidad/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}