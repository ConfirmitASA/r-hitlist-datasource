/**
 * Created by IvanP on 10.01.2017.
 */

class HitlistSetup{
  constructor(){
    //fix for window.location origin, thanx IE
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }

    this._config = HitlistSetup.getOriginalConfig();
    this._elementType = window.HitListElementType;
    this._op = window.SearchableListOperator;
  }

  /**
   * This method allows getting a localised string in the language of the report from Hitlist config.
   *
   * @param {String} key - the key to look the property up
   *
   * * `stoe`:"Smaller than or equal",
   * * `gtoe`:"Greater than or equal",
   * * `between`:"Between",
   * * `before`:"Before",
   * * `after`:"After",
   * * `exactly`:"Exactly",
   * * `showdefaultcols`:"Show default columns",
   * * `apply`:"Apply",
   * * `cancel`:"Cancel",
   * * `showhide`:"Show / Hide columns",
   * * `yes`:"Yes",
   * * `no`:"No",
   * * `loadingData`:"Loading data, please wait...","
   * * `checkall`:"Check all",
   * * `uncheckall`:"Uncheck all",
   * * `errorLoading`:"Error loading data",
   * * `errorNoColumns`:"No columns selected"
   * * `REPORT_SINGLEVIEW_RESPONDENTOVERVIEW`:"Respondent overview",
   * * `REPORT_SINGLEVIEW_PRINT`:"Print the current respondent",
   * * `REPORT_SINGLEVIEW_CLOSE`:"Close this overlay",
   * * `REPORT_SINGLEVIEW_FILTER`:"Filter questions",
   * * `REPORT_SINGLEVIEW_NOTHINGFOUND`:"No questions match your search",
   * * `REPORT_SINGLEVIEW_PREVIOUS`:"Previous",
   * * `REPORT_SINGLEVIEW_PREVIOUSHINT`:"Previous respondent",
   * * `REPORT_SINGLEVIEW_NEXT`:"Next",
   * * `REPORT_SINGLEVIEW_NEXTHINT`:"Next respondent",
   * * `REPORT_SINGLEVIEW_OF`:"{0} of {1}",
   * * `REPORT_SINGLEVIEW_MORE`:"{0} more",
   * * REPORT_SINGLEVIEW_ALTERNATIVES`:"Answers alternatives:"
   *
   * @returns {String}
   * */
  i18n(key){
    return this._config.captions.hasOwnProperty(key)?this._config.captions[key]:this._config.singleViewTexts.hasOwnProperty(key)?this._config.singleViewTexts[key]:null
  }

  get data(){return this._config.hitlistData}

  set data(data){
    this._config.hitlistData = data;
  }
  get disableNextButton(){
    return this.sortingPagingValues.disableNextButton || false
  }
  get disablePrevButton(){
    return this.sortingPagingValues.disablePrevButton || false
  }

  /**
   * Returns an array of currently visible HitList columns of Object type: `{key:String, label:String, Sortable:Boolean, hiddenByDefault:Boolean, abbr:String,allowHTML:Boolean, alternativeStyle:String, contentStyle:String, headerStyle:String}`
   * @returns {Array.<{key:String, label:String, Sortable:Boolean, hiddenByDefault:Boolean, abbr:String,allowHTML:Boolean, alternativeStyle:String, contentStyle:String, headerStyle:String}>} Returns an array of currently visible HitList columns
   * */
  get columns(){return this._config.columns}

  /**
   * Returns an array of all HitList columns of Object type: `{key:String, label:String, Sortable:Boolean, hiddenByDefault:Boolean, abbr:String,allowHTML:Boolean, alternativeStyle:String, contentStyle:String, headerStyle:String}`
   * @returns {Array}
   * */
  get allColumns(){return this._config.allColumns}

  get hitlistID(){return this._config.componentId}
  get pageID(){return this._config.pageId}
  get language(){return this._config.language}
  get serviceURL(){return `${window.location.origin}${this._config.serviceUrl}`}
  get pageStateID(){return document.querySelector('#PageStateId')? document.querySelector('#PageStateId').value:undefined}
  get sortingPagingValues(){
    return this._config.sortingPagingValues!=null?this._config.sortingPagingValues:{}
  }
  set sortingPagingValues(val){
    this._config.sortingPagingValues = val;
  }

  static _fixJsonDate(jsonDate) {
    if (!(jsonDate && Y && Y.Lang.isFunction(jsonDate.replace))) {return jsonDate;}
    let constr = jsonDate.replace(new RegExp("^/Date\\(([-+]?\\d+)\\)/$"), "new Date($1)");
    if (constr == jsonDate) {return jsonDate;}
    return eval(constr);
  }


  /**
   * Extracts the config for a HitList if it's initialised on the page
   * ```
   * {
   *  allColumns:Array,
   *  captions:Object,
   *  clientId:String,
   *  columns:Array,
   *  componentId:String,
   *  hashedProjectId:String,
   *  hitlistData:Array,
   *  language:Number,
   *  nextText:String,
   *  noInitialLoad:Boolean,
   *  pageAjaxEnabled:Boolean,
   *  pageId:String,
   *  prevText:String,
   *  preview:Boolean,
   *  searchItems:Array,
   *  searchValues:Array,
   *  serviceUrl:String,
   *  serviceUrlMetaData:String,
   *  showSingleViewOnRowSelect:Boolean,
   *  singleViewApiUrl:String,
   *  singleViewFormsChunkApiUrl:String,
   *  singleViewTexts:Object,
   *  sortingPagingValues:Object,
   *  styles:Object,
   *  version:String
   * }
   * ```
   *
   * */
  static getOriginalConfig(){
    let scripts = document.querySelectorAll('script');
    if(scripts){
      let i=scripts.length,
          cfg = /(Y\.Reportal\.HitList,)\s(.*?)\);/gi;
      while(i--){
        let script = scripts[i].text;
        if(script.indexOf('Y.Reportal.HitList,')>-1){
          let exec = cfg.exec(script);
          return (exec!=null && exec[2])? JSON.parse(exec[2]): null;
        }
      }
    } else {
      throw new Error('Hitlist config is not present on the page')
    }
  }
}

export default HitlistSetup
