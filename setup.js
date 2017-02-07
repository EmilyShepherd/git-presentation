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

    var deleteLetters = function(el, letters, cb)
    {
        var run = function()
        {
            if (letters-- > 0)
            {
                el.innerText = el.innerText.substr(0, el.innerText.length - 1);
                window.setTimeout(run, 20);
            }
            else if (typeof cb === 'function')
            {
                cb();
            }
        };

        run();
    };

    var typeLetters = function(el, letters, cb)
    {
        var run = function()
        {
            if (letters.length !== 0)
            {
                el.innerText += letters.substr(0, 1);
                letters = letters.substr(1);
                window.setTimeout(run, 20);
            }
            else if (typeof cb === 'function')
            {
                cb();
            }
        };

        run();
    };

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
        },
        function()
        {
            document.getElementById('typing').style.visibility = 'visible';
        },
        function()
        {
            deleteLetters
            (
                document.getElementById('lineB'),
                64,
                function()
                {
                    deleteLetters
                    (
                        document.getElementById('lineA'),
                        16
                    );
                }
            );
        },
        function()
        {
            deleteLetters
            (
                document.getElementById('person'),
                7,
                function()
                {
                    typeLetters
                    (
                        document.getElementById('person'),
                        'Harold'
                    );
                }
            );
        },
        function()
        {
            deleteLetters
            (
                document.getElementById('person'),
                6,
                function()
                {
                    typeLetters
                    (
                        document.getElementById('person'),
                        'either Harold or William'
                    );
                }
            );
        },
        function()
        {
            this.branchB.merge(this.master);
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
        document.getElementById('typing').style.visibility = 'hidden';
    };

    var slide6 = new gitSlide('commits-shown-6', 'gitGraph6',
    [
        function()
        {
            document.getElementById('typing2').style.visibility = 'visible';
        },
        function()
        {
            deleteLetters
            (
                document.getElementById('lineB2'),
                64,
                function()
                {
                    deleteLetters
                    (
                        document.getElementById('lineA2'),
                        16,
                        function()
                        {
                            deleteLetters
                            (
                                document.getElementById('person2'),
                                7,
                                function()
                                {
                                    typeLetters
                                    (
                                        document.getElementById('person2'),
                                        'Harold, then William invaded'
                                    );
                                }
                            );
                        }
                    );
                }
            );
        },
        function()
        {
            this.branchB.commits.forEach(function(el)
            {
                el.messageColor = "#0FF";
                el.dotColor = "#0FF";
            });
            this.branchC = this.master.branch
            ({
                name: 'william',
                commitDefaultOptions: { color: '#00F' }
            });
            this.branchC.commit('William is king!');
        },
        function()
        {
            this.branchC.merge(this.master);
        }
    ]);

    slide6.setup = function()
    {
        slide5.setup.call(this);
        this.branchA.merge(this.master);
        document.getElementById('typing2').style.visibility = 'hidden';
    };

    (function()
    {
        var fileA = document.getElementById('fileA');
        var fileB = document.getElementById('fileB');
        var cmd = document.getElementById('cmd');
        var cmdline = document.getElementById('cmdline');
        var hi_js = document.getElementById('hi_js');

        var typeCmd = function(command, output, cb)
        {
            typeLetters(cmdline, command + "\n", function()
            {
                if (output)
                {
                    var span = document.createElement('span');
                    span.style.color = 'green';
                    cmd.appendChild(span);
                    span.innerText = output + "\n";
                }

                span = document.createTextNode('/project> ');
                cmd.appendChild(span);

                cmdline = document.createElement('span');
                cmd.appendChild(cmdline);

                document.getElementById('cmd_holder').scrollTop = 9999999;

                if (typeof cb === 'function')
                {
                    cb();
                }
            });
        };

        var slide7 = new gitSlide('cmd', 'gitGraph7',
        [
            function()
            {
                typeCmd('git init', 'Initialized empty git repository in /project');
            },
            function()
            {
                typeCmd
                (
                    'git status',
                    "On branch master\n\nUntracked files:\n\n" +
                    "myFile.html\nmyOtherFile.js"
                );
            },
            function()
            {
                typeCmd
                (
                    'git add myFile.html myOtherFile.js'
                );
            },
            function()
            {
                typeCmd
                (
                    'git status',
                    "On branch master\n\nChanges to be committed:\n\n" +
                    "myFile.html\nmyOtherFile.js"
                );
            },
            function()
            {
                var _self = this;
                typeCmd
                (
                    'git commit -m "My First Commit!"',
                    "[master (root-commit 6988c2a] My First Commit!\n" +
                    " 2 files changed, 5 insertions(+)\n" +
                    " create mode 100644 myFile.html\n" +
                    " create mode 100644 myOtherFile.js",
                    function()
                    {
                        _self.master.commit('My First Commit!');
                    }
                );
            },
            function()
            {
                typeCmd
                (
                    'git status',
                    "On branch master\nNothing to commit, working tree clean"
                );
            },
            function()
            {
                deleteLetters(hi_js, 12, function()
                {
                    typeLetters
                    (
                        hi_js,
                        "console.log('Hello There');\n" +
                        "console.log('Git is fun!');"
                    );
                });
            },
            function()
            {
                typeCmd
                (
                    'git diff',
                    "diff --git a/myOtherFile.js a/myOtherFile.js\n" +
                    "index 08ee1af..9e8bb6b 100644\n" +
                    "--- a/myOtherFile.js\n" +
                    "+++ b/myOtherFile.js\n" +
                    "@@ -1,3 +1,4 @@\n" +
                    "function() {\n" +
                    "-alert('Hi');\n" +
                    "+console.log('Hello There')\n" +
                    "+console.log('Git is fun!)\n" +
                    "}"
                );
            },
            function()
            {
                document.getElementById('html_html').innerText = 'HTML';
            },
            function()
            {
                typeCmd
                (
                    'git status',
                    "On branch master\nChanges not staged for commit:\n\n" +
                    "modified: myFile.html\n" +
                    "modified: myOtherFile.js"
                );
            },
            function()
            {
                var _self = this;
                typeCmd
                (
                    'git add myFile.html', '', function()
                    {
                        typeCmd
                        (
                            'git commit -m "Fix HTML misspelling"',
                            "[master db6991e] Fix HTML misspelling\n" +
                            " 1 file changed, 1 insertion(+), 1 deletion(-)",
                            function()
                            {
                                _self.master.commit('Fix HTML misspelling');
                            }
                        );
                    }
                );
            },
            function()
            {
                typeCmd
                (
                    'git status',
                    "On branch master\nChanges not staged for commit:\n\n" +
                    "modified: myOtherFile.js"
                );
            },
            function()
            {
                var _self = this;
                typeCmd
                (
                    'git checkout -b some-js-changes',
                    "M  myOtherFile.js\n" +
                    "Switched to a new branch 'some-js-changes'",
                    function()
                    {
                        _self.jsBranch = _self.master.branch('some-js-changes');
                    }
                );
            },
            function ()
            {
                var _self = this;
                typeCmd
                (
                    'git add myOtherFile.js', '', function()
                    {
                        typeCmd
                        (
                            'git commit -m "Change the Javascript"',
                            "[some-js-changes db6991e] Change the Javascript\n" +
                            " 1 file changed, 2 insertions(+), 1 deletion(-)",
                            function()
                            {
                                _self.jsBranch.commit('Change the Javascript');
                            }
                        );
                    }
                );
            },
            function()
            {
                typeCmd
                (
                    'git show',
                    "commit db6991edb6991edb6991edb6991edb6991e\n" +
                    "Author: Emily Shepherd <emily.shepherd@wearetwogether.com>\n" +
                    "Date: Wedesday Feb 8 10:30:00 2017 +0000\n\n" +
                    "Change the Javascript\n\n" +
                    "diff --git a/myOtherFile.js a/myOtherFile.js\n" +
                    "index 08ee1af..9e8bb6b 100644\n" +
                    "--- a/myOtherFile.js\n" +
                    "+++ b/myOtherFile.js\n" +
                    "@@ -1,3 +1,4 @@\n" +
                    "function() {\n" +
                    "-alert('Hi');\n" +
                    "+console.log('Hello There')\n" +
                    "+console.log('Git is fun!)\n" +
                    "}"
                );
            },
            function()
            {
                typeCmd
                (
                    'git checkout master',
                    "Switched to branch 'master'",
                    function()
                    {
                        hi_js.innerText = "alert('Hi');";
                    }
                );
            },
            function()
            {
                var extra_html = document.getElementById('extra_html');
                typeLetters(extra_html, '<p>HTML is <b>crazy</b></p>');
            },
            function()
            {
                var _self = this;
                typeCmd
                (
                    'git add myFile.html', '', function()
                    {
                        typeCmd
                        (
                            'git commit -m "More HTML"',
                            "[master db6991e] More HTML\n" +
                            " 1 file changed, 1 insertion(+)",
                            function()
                            {
                                _self.master.commit('More HTML');
                            }
                        );
                    }
                );
            },
            function()
            {
                var _self = this;
                typeCmd
                (
                    'git merge some-js-changes',
                    "Merge made by the 'recursive' strategy.\n" +
                    " myOtherFile.js | 3 ++-\n" +
                    " 1 file changes, 2 insertions(+), 1 deletion(-)",
                    function()
                    {
                        _self.jsBranch.merge(_self.master);
                        hi_js.innerText = "console.log('Hello There');\n" +
                          "console.log('Git is fun!');"
                    }
                );
            }
        ]);

        slide7.setup = function()
        {
            this.git.template.commit.message.displayHash = false;
            this.git.template.arrow.size = 0;
        };
    })();

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

