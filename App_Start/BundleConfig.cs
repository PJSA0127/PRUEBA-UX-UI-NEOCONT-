using System.Web;
using System.Web.Optimization;

namespace PRUEBA_UX_UI__NEOCONT_
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/styles.css"));

            bundles.Add(new StyleBundle("~/Content/bootstrap", 
                "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"));

            bundles.Add(new ScriptBundle("~/Scripts/js").Include(
                "~/Scripts/functions.js"));

            bundles.Add(new ScriptBundle("~/Scripts/jquery", 
                "https://code.jquery.com/jquery-1.9.1.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/bootstrap", 
                "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.validate*"));
            
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));
        }
    }
}
