function KChart(chartid, config){

  this.chartid = chartid;

  this.origin_config = config;

  this.default_config = {
    light : {
      backgroundColor : '#ffffff',
      data : {
        labels : []
      },
      xAxes : {
        display : true,
        paddingTop : 5,
        PaddingBottom : 5,
        lineColor : '#343a40'
      },
      yAxes : {
        display : true,
        paddingLeft : 5,
        paddingRight : 5,
        lineColor : '#343a40'
      }
    },
    dark : {
      backgroundColor : '#343a40',
      data : {
        labels : []
      },
      xAxes : {
        display : true,
        paddingTop : 5,
        paddingBottom : 5,
        lineColor : '#ffffff',
        lineWidth : 1
      },
      yAxes : {
        display : true,
        paddingLeft : 5,
        paddingRight : 5,
        lineColor : '#ffffff',
        lineWidth : 1
      }
    }
  };

  this.width = 0;

  this.height = 0;

  this.width_used = {
    yAxes : 0
  };

  this.height_used = {
    xAxes : 0
  };

  this.init_config = {};

  if (undefined === this.chartid || null === this.chartid) return;

  this.chart_canvas = document.getElementById(this.chartid);
  if (null === this.chart_canvas || this.chart_canvas.localName !== 'canvas') return;

  this.initConfig();

  this.chart_context = this.chart_canvas.getContext('2d');
  this.clearChart();
  this.resetChartSize();
  this.setChartBackground();
  this.drawXAxes();
}

KChart.prototype.isObject = function(obj){
  var _kchart_isObject = Object.name.toLowerCase() === typeof(obj);
  return _kchart_isObject && null !== obj;
};

KChart.prototype.isString = function(str){
  return (
    String.name.toLowerCase() === typeof(str) || 
    str instanceof String || 
    Object.prototype.toString.call(str) === '[object String]'
  );
};

KChart.prototype.isNumber = function(num){
  return (
    typeof(num) === Number.name.toLowerCase() || 
    num instanceof Number || 
    Object.prototype.toString.call(num) === '[object Number]'
  );
};

KChart.prototype.inArray = function(arr, el){
  return Array.isArray(arr) && !!~arr.indexOf(el);
};

KChart.prototype.isBoolean = function(bool){
  return this.inArray([!1, !0], bool);
};

KChart.prototype.isHexColor = function(color){
  return this.isString(color) && /^#([1-9a-f]{3}){1,2}$/gi.test(color);
};

KChart.prototype.initConfig = function(){
  if (!this.isObject(this.origin_config) || null === this.origin_config) return;

  var _kchart_origin = this.origin_config
  , _kchart_theme = _kchart_origin.theme || 'light';

  _kchart_theme = _kchart_theme in this.default_config ? _kchart_theme : 'light';
  this.init_config = this.default_config[_kchart_theme];

  var _kchart_me = this
  , _kchart_data = _kchart_origin.data;
  
  // data
  if (this.isObject(_kchart_data)){
    if (Array.isArray(_kchart_data.labels)){
      var _kchart_labels = _kchart_data.labels.filter(function(value){
        return _kchart_me.isString(value) || _kchart_me.isNumber(value);
      });
  
      _kchart_labels.length === _kchart_data.labels.length && 
      (this.init_config.data.labels = _kchart_labels);
    }

    if (Array.isArray(_kchart_data.dataset)){
      var _kchart_dataset = _kchart_data.dataset.filter(function(value){
        return _kchart_me.isString(value) || _kchart_me.isNumber(value);
      });

      _kchart_dataset.length === _kchart_data.dataset.length && 
      (this.init_config.data.dataset = _kchart_dataset);
    }
  }
  
  // xAxes
  if (this.isObject(_kchart_origin.xAxes)){
    var _kchart_xAxes = _kchart_origin.xAxes;
    
    this.isBoolean(_kchart_xAxes.display) && 
    (this.init_config.xAxes.display = _kchart_xAxes.display);
    
    this.isNumber(_kchart_xAxes.paddingTop) &&
    (this.init_config.xAxes.paddingTop = _kchart_xAxes.paddingTop);

    this.isNumber(_kchart_xAxes.paddingBottom) &&
    (this.init_config.xAxes.paddingBottom = _kchart_xAxes.paddingBottom);

    this.isHexColor(_kchart_xAxes.lineColor) && 
    (this.init_config.xAxes.lineColor = _kchart_xAxes.lineColor);

    this.isNumber(_kchart_xAxes.lineWidth) && _kchart_xAxes.lineWidth > 0 &&
    (this.init_config.xAxes.lineWidth = _kchart_xAxes.lineWidth);
  }

  // yAxes
  if (this.isObject(_kchart_origin.yAxes)){
    var _kchart_yAxes = _kchart_origin.yAxes;

    this.isBoolean(_kchart_yAxes.display) && 
    (this.init_config.yAxes.display = _kchart_yAxes.display);

    this.isNumber(_kchart_yAxes.paddingLeft) &&
    (this.init_config.yAxes.paddingLeft = _kchart_yAxes.paddingLeft);

    this.isNumber(_kchart_yAxes.paddingRight) && 
    (this.init_config.yAxes.paddingRight = _kchart_yAxes.paddingRight);

    this.isHexColor(_kchart_yAxes.lineColor) && 
    (this.init_config.yAxes.lineColor = _kchart_yAxes.lineColor);

    this.isNumber(_kchart_yAxes.lineWidth) && _kchart_yAxes.lineWidth > 0 &&
    (this.init_config.yAxes.lineWidth = _kchart_yAxes.lineWidth);
  }

  // grid
};

KChart.prototype.clearChart = function(){
  this.chart_context.clearRect(0, 0, this.chart_canvas.width, this.chart_canvas.height);
};

KChart.prototype.resetChartSize = function(){
  this.chart_context.width = this.chart_canvas.width;
  this.chart_context.height = this.chart_canvas.height;
  this.width = this.chart_canvas.width;
  this.height = this.chart_canvas.width;
};

KChart.prototype.setChartBackground = function(){
  this.chart_context.fillStyle = this.init_config.backgroundColor;
  this.chart_context.fillRect(0, 0, this.chart_canvas.width, this.chart_canvas.height);
};

KChart.prototype.drawXAxes = function(){
  if (this.init_config.xAxes.display && this.origin_config.data.labels.length){
    var _kchart_me = this
    , _kchart_height_xAxes = this.origin_config.data.labels.map(function(value){
      console.log('value', value)
      console.log('_kchart_me.measureText(value)', _kchart_me.measureText(value));
      return _kchart_me.measureText(value).height;
    });

    console.log('_kchart_height_xAxes', _kchart_height_xAxes)

    _kchart_height_xAxes = Math.max(_kchart_height_xAxes);
    _kchart_me.height_used.xAxes = _kchart_height_xAxes;

    console.log('_kchart_height_xAxes', _kchart_height_xAxes);
    console.log('this.init_config.xAxes.paddingTop', this.init_config.xAxes.paddingTop);
    console.log('this.init_config.xAxes.paddingBottom', this.init_config.xAxes.paddingBottom);

    var _kchart_height_xAxes_all = _kchart_height_xAxes 
    + this.init_config.xAxes.paddingTop + this.init_config.xAxes.paddingBottom
    , _kchart_height_area_chart = this.height - _kchart_height_xAxes_all
    , _kchart_startX_xAxes_line = 0
    , _kchart_startY_xAxes_line = _kchart_height_area_chart
    , _kchart_endX_xAxes_line = this.width
    , _kchart_endY_xAxes_line = _kchart_height_area_chart
    , _kchart_color_xAxes_line = this.init_config.xAxes.lineColor
    , _kchart_width_xAxes_line = this.init_config.xAxes.lineWidth;
    console.log('_kchart_height_xAxes_all', _kchart_height_xAxes_all);
    _kchart_me.line(
      _kchart_startX_xAxes_line,
      _kchart_startY_xAxes_line,
      _kchart_endX_xAxes_line,
      _kchart_endY_xAxes_line,
      _kchart_width_xAxes_line,
      _kchart_color_xAxes_line
    );
  }
}

KChart.prototype.line = function(sX, sY, eX, eY, lw, cl){console.log(sX, sY, eX, eY, lw, cl);
  if (
    this.isNumber(sX) &&
    this.isNumber(sY) &&
    this.isNumber(eX) &&
    this.isNumber(eY) &&
    this.isNumber(lw) &&
    this.isHexColor(cl)
  ){
    this.chart_context.beginPath();
    this.chart_context.moveTo(sX, sY);
    this.chart_context.lineTo(eX, eY);
    this.chart_context.lineWidth = lw;
    this.chart_context.strokeStyle = cl;
    this.chart_context.stroke();
  }
};

KChart.prototype.measureText = function(str){
  var width = 0, height = 0;

  if (this.isString(str) || this.isNumber(str)){
    var _kchart_measure = this.chart_context.measureText(str);
    width = _kchart_measure.width;
    height = _kchart_measure.height;
  }

  return { width, height };
}