(function () {

    var module = angular.module('pageControllers');

    module.controller('GraderController', ['$scope', '$http', '$routeParams', '$location',
        function ($scope, $http, $routeParams, $location) {
            $scope.loaded = false;
            $scope.loadingMessage = "Loading...";
            $scope.title = "SENG301 Grade Estimator";
            $scope.mark = "A+";

            $scope.toMark = function(mark) {
                if (mark >= 0.9) {
                    return "A+";
                }
                else if (mark >= 0.85) {
                    return "A";
                }
                else if (mark >= 0.8) {
                    return "A-";
                }
                else if (mark >= 0.75) {
                    return "B+";
                }
                else if (mark >= 0.70) {
                    return "B";
                }
                else if (mark >= 0.65) {
                    return "B-";
                }
                else if (mark >= 0.60) {
                    return "C+";
                }
                else if (mark >= 0.55) {
                    return "C";
                }
                else if (mark >= 0.50) {
                    return "C-";
                }
                else if (mark >= 0.4) {
                    return "D";
                }
                return "E";
            };

            function Question(question, answers, evaluator, verify) {
                this.error = "";
                this.answer = -1;
                this.question = question;
                this.answers = answers;
                this.evaluator = evaluator;
                if (verify) {
                    this.verify = verify;
                }
                else {
                    this.verify = function(){}
                }
            }
            $scope.questions = [
                new Question("Did you attend the exam?", ["Yes", "No"], function(mark) {
                        if (this.answer == 0) return mark + 0.6;
                        $scope.mark = "E";
                        throw -403;
                    },
                    function() {
                        if (this.answer == 1) {
                            this.error = "You needed to attend the exam to pass the course...";
                        }
                        else {
                            this.error = "";
                        }
                    }
                ),
                new Question("How well did you feel the exam went?", [
                        "I am a liar.",
                        "Studying is my hobby.",
                        "What's next?",
                        "Early leaving is for suckers.",
                        "What in the F is a repeating group?",
                        "The steam sale has some good games.",
                        "The cake is a lie."],
                    function(mark) {
                        return mark - 0.6 * (1/7)*this.answer;
                    }
                ),
                new Question("How often did you attend lectures?", [
                        "There was lectures for this course?",
                        "Maybe Once",
                        "Multiple Times!",
                        "Regularly",
                        "Frequently",
                        "Missed a Few",
                        "Always"],
                    function(mark) {
                        switch (this.answer) {
                            case "0": return mark - 0.15;
                            case "1": return mark - 0.10;
                            case "2": return mark - 0.05;
                            case "3": return mark;
                            case "4": return mark + 0.05;
                            case "5": return mark + 0.10;
                            case "6": return mark + 0.15;
                        }
                    }
                ),
                new Question("When you attended lectures/labs, did you actually pay attention?", [
                        "I was gaming.",
                        "I was doing an assignment.",
                        "I was facebooking.",
                        "I was stackoverflowing.",
                        "I was redditing.",
                        "I was reading.",
                        "I was sleeping.",
                        "Yes."
                    ],
                    function(mark) {
                        return mark - 0.25 * (1/7)*(7-this.answer);
                    },
                    function() {
                        if (this.answer == 7) {
                            this.error = "Liar.";
                        }
                        else {
                            this.error = "";
                        }
                    }
                ),
                new Question("Did you attend the labs?", [
                        "Yes",
                        "No"
                    ],
                    function(mark) {
                        return mark + (this.answer == 0 ? 0.15 : 0);
                    }
                ),
                new Question("How often did you complain about Neville not marking the reports?", [
                        "Every. Day.",
                        "Constantly",
                        "There was nothing to mark",
                        "Occasionally",
                        "What are you talking about? Neville is a fast marker."
                    ],
                    function(mark) {
                        return mark - 0.2 * (1/4)*(4-this.answer);
                    }
                ),
                new Question("Have you or any of your friends annoyed Moffat at any point?", [
                        "Yes",
                        "Somewhat",
                        "I'm sure we have",
                        "Who's Moffat?"
                    ],
                    function(mark) {
                        return mark - 0.2 * (1/3)*(3-this.answer);
                    }
                ),
                new Question("Did you do report 5?", [
                        "There were 5 reports?",
                        "Stuff that",
                        "No",
                        "Neville still hasn't given me a mark so no",
                        "Yeah"
                    ],
                    function(mark) {
                        if (this.answer == 4) return mark + 0.1;
                        if (this.answer == 3 || this.answer == 2) return mark;
                        return mark - 0.1;
                    }
                ),
                new Question("When Moffat talked about \"touching his privates\" you thought:", [
                        "Accessibility",
                        "Some kind of sexual act he was forcing on you",
                        "About running away (see above)",
                        "I should note this down",
                        "Fallout 4 is awesome looking",
                        "When can I go home",
                        "Why is a lab more like a forced hellish philosophy lecture?"
                    ],
                    function (mark) {
                        switch (this.answer) {
                            case "0": return mark + 0.1;
                            case "1": return mark - 0.1;
                            case "2": return mark - 0.1;
                            case "3": return mark + 0.05;
                            case "4": return mark;
                            case "5": return mark + 0.05;
                            case "6": return mark + 0.1;
                        }
                    }
                ),
                new Question("Have you ever applied any of your new found knowledge from this course?", [
                        "Yes, I frequently run C & K metrics on my code",
                        "Cyclomatic complexity is the god metric",
                        "I love useless statistics",
                        "DBC means \"Death By Crying\", I did it after my SENG302 exam",
                        "Knowledge? What is this concept?",
                        "I use them but ignore them in SENG302"
                    ],
                    function(mark) {
                        switch (this.answer) {
                            case "0": return mark + 0.15;
                            case "1": return mark - 0.05;
                            case "2": return mark - 0.1;
                            case "3": return mark + 0.05;
                            case "4": return mark;
                            case "5": return mark + 0.1;
                        }
                    }
                )
            ];

            $scope.calculate = function() {
                var mark = 0.4;
                for (var i = 0; i < $scope.questions.length; i++) {
                    try {
                        if (!$scope.questions[i].answer || $scope.questions[i].answer < 0) {
                            continue;
                        }
                        $scope.questions[i].verify();
                        mark = $scope.questions[i].evaluator(mark);
                    }
                    catch(e) {
                        if (e === -403) return;
                        console.log(e);
                    }
                }
                $scope.mark = $scope.toMark(mark);
            };

            $scope.loaded = true;
        }
    ]);

}());