using System.Web;
using System.Web.Mvc;

namespace PRUEBA_UX_UI__NEOCONT_
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
