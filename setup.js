(function()
{
    'use strict';

    var pie;
    var bake = (function()
    {
        pie = new d3pie("pieChart",
        {
            "data":
            {
                "content":
                [
                    {
                        "label": "Git",
                        "value": 69.3,
                        "color": "#7e3838"
                    },
                    {
                        "label": "SVN",
                        "value": 36.9,
                        "color": "#7e6538"
                    },
                    {
                        "label": "TFS",
                        "value": 12.2,
                        "color": "#7c7e38"
                    },
                    {
                        "label": "Mercurial",
                        "value": 7.9,
                        "color": "#587e38"
                    },
                    {
                        "label": "Other",
                        "value": 13.3,
                        "color": "#386a7e"
                    },
                    {
                        "label": "None",
                        "value": 9.3,
                        "color": "#000"
                    }
                ]
            },
            "size":
            {
                "canvasWidth": 700
            },
            "footer":
            {
                "text" : "Source: Stack Overflow Developer Survey 2015",
                "location" : "bottom-center"
            },
            "labels":
            {
                "outer":
                {
                    "pieDistance": 32
                },
                "inner":
                {
                    "format" : "value",
                    "hideWhenLessThanPercentage": 5
                },
                "mainLabel":
                {
                    "font": "Cooper Black",
                    "fontSize": 20
                },
                "value":
                {
                    "color": "#FFF",
                    "font": "Cooper Black",
                    "fontSize": 20
                },
                "lines":
                {
                    "enabled": true,
                    "color": "#000"
                }
            },
            "misc":
            {
                "gradient":
                {
                    "enabled": true,
                    "percentage": 100
                }
            }
        });
    });

    bake();

    Reveal.addEventListener('pie-shown', function()
    {
        if (pie)
        {
            pie.destroy();
        }

        window.setTimeout(bake, 500);
    }, false);

    Reveal.initialize
    ({
        controls: false,
        progress: true,
        history: false,
        center: true,
        transition: 'slide'
    });
})();

