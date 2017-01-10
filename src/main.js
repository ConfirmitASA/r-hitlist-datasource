/**
 * Created by IvanP on 07.09.2016.
 */

import HitlistDatasource from "./hitlist-datasource";
import ReportalBase from "r-reportal-base";

window.Reportal = window.Reportal || {};
ReportalBase.mixin(window.Reportal,{
  HitlistDatasource
});
export default HitlistDatasource;
