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

    var current_commit;

    var template =
    {
        colors: ["#F00", "#e67e22", "#00F"],
        arrow:
        {
            size: 26
        },
        branch:
        {
            lineWidth: 5,
            spacingX: 50,
            color: "#000"
        },
        commit:
        {
            spacingY: -100,
            dot:
            {
                size: 20,
                strokeColor: "#000",
                strokeWidth: 10
            },
            message:
            {
                displayAuthor: false,
                displayBranch: false,
                displayHash: true,
                font: "30px monospace"
            }
        }
    };

    bake();

    Reveal.addEventListener('pie-shown', function()
    {
        if (pie)
        {
            pie.destroy();
        }

        window.setTimeout(bake, 500);
    }, false);

    var gitSlide = function(state, elementId, actions, setup)
    {
        var _self = this;
        this.elementId = elementId;
        this.steps = actions;

        if (typeof setup === "function")
        {
            this.setup = setup;
        }
        else
        {
            this.step = null;
        }

        Reveal.addEventListener(state, (function()
        {
            _self.init();
        }), false);
    };

    gitSlide.prototype.init = (function()
    {
        this.git = new GitGraph
        ({
            template: template,
            elementId: this.elementId,
            reverseArrow: true,
            initCommitOffsetY: -20
        });

        this.master = this.git.branch("develop");
        this.step = 0;
        var _self = this;

        if (typeof this.setup === "function")
        {
            this.setup();
        }

        Reveal.configure
        ({
            keyboard:
            {
                32: (function()
                {
                    _self.runStep();
                })
            }
        });
    });

    gitSlide.prototype.runStep = (function()
    {
        var step = this.steps[this.step++];

        switch (typeof step)
        {
            case "function":
                step.call(this);
                break
            default:
                this.master.commit(step);
        }

        if (this.step === this.steps.length)
        {
            Reveal.configure({keyboard: {}});
        }
    });

    var slide1 = new gitSlide('commits-shown-1', 'gitGraph1',
    [
        {
            message: "Initial Commit",
            sha1: "e89e7d4"
        },
        "Second Commit, ontop of e89e7d4",
        "Add some new feature",
        "Fix feature, because it failed QA",
        "Failed QA again, maybe this'll fix it",
        "QA found more problems"
    ]);

    var slide2 = new gitSlide('commits-shown-2', 'gitGraph2',
    [
        function()
        {
            this.develop = this.git.branch('CB-123');
            this.develop.commit(
                "CB-123: Migrate Campaigns"
            );
            this.develop.commit(
                "CB-123: Migrate Templates"
            );
        },
        function()
        {
            this.develop2 = this.master.branch
            ({
                name: "CB-482",
                parentCommit: this.master.commits[1]
            });
            this.develop2.commit
            (
                "CB-482: Fix CSV Downloads"
            );
        },
        function ()
        {
            this.develop.commit
            (
                'CB-123: Continue development'
            );
        },
        function()
        {
            this.develop2.merge(this.master);
        },
        function()
        {
            this.develop.merge(this.master);
        }
    ]);

    slide2.setup = function()
    {
        this.git.template.arrow.size = 0;
        this.master.commit(' ').commit(' ').commit(' ');
    };

    var slide3 = new gitSlide('commits-shown-3', 'gitGraph3',
    [
        function()
        {
            this.mysql.commit('MySQL branch');
        },
        function()
        {
            this.branch1 = this.mysql.branch('CB-34');
            this.branch1.commit
            (
                "CB-34: Migrate Global Admin"
            );
            this.branch1.commit
            (
                "CB-34: Migrate Global Admin"
            );
        },
        function()
        {
            this.branch2 = this.mysql.branch('CB-35');
            this.branch2.commit
            (
                "CB-35: System Language"
            );
        },
        function()
        {
            this.branch1.merge(this.mysql);
            this.branch2.merge(this.mysql);
        },
        function()
        {
            this.mysql.merge(this.master);
        }
    ]);

    slide3.setup = function()
    {
        this.git.template.arrow.size = 0;
        this.master.commit(' ');
        this.mysql = this.master.branch('mysql');
    };

    var slide4 = new gitSlide('commits-shown-4', 'gitGraph4',
    [
        function()
        {
            this.branchA.merge(this.master);
        },
        function()
        {
            this.branchC = this.master.branch
            ({
                name: 'loading-spinner',
                commitDefaultOptions:
                {
                    color: '#00F'
                }
            });
            this.branchC.commit('Loading Spinner (Copy of 644e4d1)');
            this.branchC.commit('More loading spinners! (Copy of 0b0b00d)');
        },
        function()
        {
            this.branchB.commits.forEach(function(el)
            {
                el.messageColor = "#0FF";
                el.dotColor = "#0FF";
            });
            this.git.render();
        },
        function()
        {
            this.branchC.merge(this.master);
        }
    ]);

    slide4.setup = function()
    {
        this.git.template.arrow.size = 0;
        this.master.commit(' ');
        this.branchA = this.master.branch('angular-js');
        this.branchA.commit('Angular JS');
        this.branchB = this.master.branch('loading-spinner');
        this.branchB.commit
        ({
            message: 'Loading Spinner',
            sha1: '644e4d1'
        }).commit
        ({
            message: 'More loading spinners!',
            sha1: '0b0b00d'
        });
        this.branchA.commit('Angular JS');
    };

    var slide5 = new gitSlide('commits-shown-5', 'gitGraph5',
    [
        function()
        {
            this.branchA.merge(this.master);
        }
    ]);

    slide5.setup = function()
    {
        this.git.template.arrow.size = 0;
        this.master.commit(' ').commit(' ');
        this.branchA = this.master.branch('harold');
        this.branchB = this.master.branch('william');
        this.branchB.commit('William is king!');
        this.branchA.commit('Harold is king!');
    };

  window.__ = slide5;

    Reveal.initialize
    ({
        controls: false,
        progress: true,
        history: true,
        center: true,
        transition: 'slide',

        width: "100%",
        height: "100%"
    });
})();

