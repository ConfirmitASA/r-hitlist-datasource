/**
 * Created by IvanP on 10.01.2017.
 */
import ReportalBase from "r-reportal-base";
import HitlistSetup from "./hitlist-setup";

class HitlistDatasource extends HitlistSetup{
  /**
   * This class allows to establish a connection with the HitList database and use utility methods to query and filter data provided there's a hitlist on the page
   * @extends HitlistSetup
   * */
  constructor(options={}){
    super();
    this._searchValues=[];
    /** @property {String} modifier - extra params added as a string from filters */
    this.modifier = '';
  }

  /**
   * performs initial data load
   * @returns {Promise} Returns a promise resolved to an array of data
   * */
  initialDataLoad(){
    this.data = null;
    return this.requestResponse({initialLoad:true})
  }
  /**
   * loads next page
   * @returns {Promise} Returns a promise resolved to an array of data
   * */
  nextPage(){
    this._skipPage(true);
    return this.requestResponse({isPaging: true},this.modifier);
  }
  /**
   * loads previous page
   * @returns {Promise} Returns a promise resolved to an array of data
   * */
  previousPage(){
    this._skipPage(false);
    return this.requestResponse({isPaging: true},this.modifier);
  }

  /**
   * queries HitList API
   * @param {Object} options
   * */
  requestResponse(options){
    let query= ReportalBase.locationDeserialize().query;
    if(query && query.reportid && this.hitlistID){
      /*set common params*/
      let params = {
        PageId: this.pageID,
        pageStateId: this.pageStateID,
        Preview: query.preview
      };

      /*if options are passed, add options*/
      if(options && typeof options === 'object'){
        for (let attrname in options) {
          params[attrname] = typeof options[attrname]==='boolean'?(options[attrname]?'1':'0'):options[attrname];
        }
      }

      if(!params.search && this._searchValues.length>0){
        params.search = JSON.stringify(this._searchValues);
      }

      let sortingPagingValues = this.sortingPagingValues;

      if (sortingPagingValues.pagingValues!=null && !isNaN(sortingPagingValues.pagingValues.pageNumber)) {
        if (options && options.initialLoad === true) {
          sortingPagingValues.pagingValues = null;
        } else {
          sortingPagingValues.pagingValues.pageNumber += sortingPagingValues.pagingValues.pagingForward ? 1 : -1;
        }
      }

      params.sortingPagingValues=JSON.stringify(sortingPagingValues);

      return ReportalBase.promiseRequest(`${this.serviceURL}&${HitlistDatasource.serializeParams(params)}${this.modifier!=''?'&'+this.modifier:''}`).then(response=>this.parseResponse(response))
    }
  }

  /**
   * Parses HitList API response
   * */
  parseResponse(response){
    response = JSON.parse(response);
    this.sortingPagingValues = response.sortingPagingValues;
    this.data = response.data;
    this.pageInfo = response.pageInfo;
    return this.data;
  }

  /**
   * @param {Boolean} pagingForward if `true` goes forward, if `null` goes backward
   * @param {!Function} callback
   * */
  _skipPage(pagingForward){
    let _spv = {...this.sortingPagingValues};
    let pv = {..._spv.pagingValues} || {};
    pv.pagingForward = pagingForward; /*if forward is needed then pass true, else null - backward*/
    pv.startId = pagingForward ? pv.lastStartId : pv.firstStartId;
    pv.startValue = pagingForward ? pv.lastStartValue : pv.firstStartValue;
    this.sortingPagingValues = {
      ...this.sortingPagingValues,
      pagingValues: pv
    };
  }

  /**
   * serialize params into a query string
   * @param {Object} params - an object with parameters
   * */
  static serializeParams(params){
    let query = [];
    for(let key in params){
      query.push([key,params[key]].join('='));
    }
    return query.join('&')
  }

}

export default HitlistDatasource;


