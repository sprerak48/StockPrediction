   var socket;
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        
        var url = 'https://limitless-plateau-96400.herokuapp.com/';
        
        loadChart();
        
        socket = io.connect(url);
        
        function Comparator(a, b) {
           if (a[0] < b[0]) return -1;
           if (a[0] > b[0]) return 1;
           return 0;
         }
         
         function UrlExists(url, cb){
            $.ajax({
                url:      url,
                dataType: 'text',
                type:     'GET',
                complete:  function(xhr){
                    if(typeof cb === 'function')
                       cb.apply(this, [xhr.status]);
                }
            });
        }
        
        function quandlURL(name) {
            return 'https://www.quandl.com/api/v3/datasets/WIKI/' + name + '.json?api_key=' + 'rXZzZzreS5bmKXwWGKbv' + '&start_date=' + (year - 1) + '-' + month  + '-' + date + '&end_date=' + year + '-' + month + '-' + date
        }
        
        socket.on('add',
            // When we receive data
            function(data) {
                var code = data.code;
                var name = data.name;
                var html = "<div class='stock-box' data-code=" + code + ">";
                html += "<button class='btn btn-danger' id=" + code + ">X</button>";
                html += "<p>" + name.slice(0, name.indexOf(" Prices")) + "</p></div>";
                $('.stock-boxes').append(html);
                loadChart();
            }
        );
        
        socket.on('remove',
            function(data) {
                var code = data.code.toUpperCase();
                
                $('.stock-box').each(function() {
                    if (code === $(this).data('code').toUpperCase()) {
                        $(this).remove();
                    }
                });
                loadChart();
            }
        );
        
        $(document).on('click', '.btn-primary', function(e){
            e.preventDefault();
            var code = $('#stock-code').val();
            var name;
            var quandl = quandlURL(code);
            
            UrlExists(quandl, function(status){
                if (status === 200) {
                    $('#stock-code').val("");
                    
                    $.ajax({
                        url: quandl,
                        type: 'get',
                        success: function(data) {
                            name = data['dataset']['name'];
                            var repeat = false;
                            $('.stock-box').each(function() {
                                if (code.toUpperCase() === $(this).data('code').toUpperCase()) {
                                    repeat = true;
                                }
                            });
                            if (!repeat) {
                                var html = "<div class='stock-box' data-code=" + code + ">";
                                html += "<button class='btn btn-danger' id=" + code + ">X</button>";
                                html += "<p>" + name.slice(0, name.indexOf(" Prices")) + "</p></div>";
                                $('.stock-boxes').append(html);
                                sendAdd(code, name);
                                loadChart();
                                $.ajax({
                                    url: url,
                                    type: 'post',
                                    data: {
                                        code: code,
                                        name: name
                                    }
                                });
                            }
                        }
                    });
                } else if (status === 404) {
                    $('#error-message').show();
                }
            });
        });
        
        // Function for sending to the socket
        function sendAdd(code, name) {

          var data = {
            code: code,
            name: name
          };
        
          // Send that object to the socket
          socket.emit('add', data);
        }
        
        function sendRemove(code) {
            var data = {
                code: code
            };
            
            socket.emit('remove', data);
        }
        
        $(document).on('click', '.btn-danger', function(e){
            e.preventDefault();
            var code = $(e.target).parent().data("code");
            sendRemove(code);
            $(e.target).parent().remove();
            $.ajax({
                type: 'delete',
                url: url,
                data: {
                    code: code
                }
            });
            loadChart();
        });
        
        function loadChart() {
            
            var seriesOptions = [],
                seriesCounter = 0,
                names = [];
                $('.stock-box').each(function() {
                    names.push($( this ).data('code').toUpperCase());
                });
                
            $('#error-message').hide();
        
            /**
             * Create the chart when all data is loaded
             * @returns {undefined}
             */
            function createChart() {
        
                $('#container').highcharts('StockChart', {
                    
                    rangeSelector: {
                        enabled: false
                    },
                    
                    navigator : {
                        enabled : false
                    },
                    
                    credits: {
                        enabled: false
                    },
                    
                    scrollbar : {
                        enabled : false
                    },
                    
                    exporting: {
                        enabled: false
                    },
        
                    yAxis: {
                        labels: {
                            formatter: function () {
                                return (this.value > 0 ? ' + ' : '') + this.value + '%';
                            }
                        },
                        plotLines: [{
                            value: 0,
                            width: 2,
                            color: 'silver'
                        }]
                    },
        
                    plotOptions: {
                        series: {
                            compare: 'percent'
                        }
                    },
        
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                        valueDecimals: 2
                    },
        
                    series: seriesOptions
                });
            }

            $.each(names, function (i, name) {
                var url = quandlURL(name);
                
                UrlExists(url, function(status){
                    if(status === 200){
                       // file was found
                       $.getJSON(url, function (data) {
                            var dataset = data['dataset']['data'];
                            var formattedData = [];
                            
                            dataset.forEach(function(d) {
                                var date = new Date(d[0]).getTime();
                                var openPrice = d[1];
                                formattedData.push([parseInt(date), openPrice]);
                            });
                            
                            formattedData.sort(Comparator);
                            
                            seriesOptions[i] = {
                                name: name,
                                data: formattedData
                            };
                
                            // As we're loading the data asynchronously, we don't know what order it will arrive. So
                            // we keep a counter and create the chart when all the data is loaded.
                            seriesCounter += 1;
                
                            if (seriesCounter === names.length) {
                                createChart();
                            }
                        });
                    }
                    else if(status === 404){
                       // 404 not found
                       // As we're loading the data asynchronously, we don't know what order it will arrive. So
                        // we keep a counter and create the chart when all the data is loaded.
                        seriesCounter += 1;
                    }
                });
            });
        };