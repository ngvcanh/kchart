function KChart(chartid, config){

  this.chartid = chartid;

  this.origin_config = config;

  this.default_config = {
    light : {
      backgroundColor : '#FFFFFF',
      data : {
        labels : []
      }
    },
    dark : {
      backgroundColor : '#343a40',
      data : {
        labels : []
      }
    }
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

}

KChart.prototype.isObject = function(obj){
  var _kchart_isObject = Object.name.toLowerCase() === typeof(obj);
  return _kchart_isObject && null !== obj;
}

KChart.prototype.isString = function(str){
  return (
    String.name.toLowerCase() === typeof(str) || 
    str instanceof String || 
    Object.prototype.toString.call(str) === '[object String]'
  );
}

KChart.prototype.initConfig = function(){
  var _kchart_isObject_config = Object.name.toLowerCase() === typeof(this.origin_config);
  if (!this.isObject(this.origin_config) || null === this.origin_config) return;

  var _kchart_theme = this.origin_config.theme || 'light';
  _kchart_theme = _kchart_theme in this.default_config ? _kchart_theme : 'light';

  this.init_config = this.default_config[_kchart_theme];
  
  if (
    this.isObject(this.origin_config.data) && 
    Array.isArray(this.origin_config.data.labels)
  ){
    var _kchart_labels = this.origin_config.data.labels.filter(this.isString);
    _kchart_labels.length === this.origin_config.data.labels.length && 
    (this.init_config.data.labels = _kchart_labels);
  }
};

KChart.prototype.clearChart = function(){
  this.chart_context.clearRect(0, 0, this.chart_canvas.width, this.chart_canvas.height);
}

KChart.prototype.resetChartSize = function(){
  this.chart_context.width = this.chart_canvas.width;
  this.chart_context.height = this.chart_canvas.height;
};

KChart.prototype.setChartBackground = function(){
  this.chart_context.fillStyle = this.init_config.backgroundColor;
  this.chart_context.fillRect(0, 0, this.chart_canvas.width, this.chart_canvas.height);
};