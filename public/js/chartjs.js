var ctx = document.getElementById("TotalChart").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(!{JSON:stringify(totalData)}, !{JSON:stringify(totalOptions)});
var ctx = document.getElementById("CUChart").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(!{JSON:stringify(CUData)}, !{JSON:stringify(SectionOptions)});
var ctx = document.getElementById("CUChart2").getContext("2d");
var myNewChart2 = new Chart(ctx).Doughnut(!{JSON.stringify(Civil_Rights_and_Liberties_Data)}, !{JSON.stringify(SectionOptions)});
var ctx = document.getElementById("CUChart3").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(!{JSON.stringify(Political_Beliefs_and_Behaviors_Data)}, !{JSON.stringify(SectionOptions)});
var ctx = document.getElementById("CUChart4").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(!{JSON.stringify(Linkage_Institutions_Data)}, !{JSON.stringify(SectionOptions)});
var ctx = document.getElementById("CUChart5").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(!{JSON.stringify(Public_Policy_Data)}, !{JSON.stringify(SectionOptions)});
var ctx = document.getElementById("CUChart6").getContext("2d");
var myNewChart2 = new Chart(ctx).Doughnut(!{JSON.stringify(Institutions_of_National_Government_Data)}, !{JSON.stringify(SectionOptions)});

//to have for smaller screens

var ctx = document.getElementById("CUChart-xs").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(!{JSON.stringify(CUData)}, !{JSON.stringify(SectionOptions)});

var ctx = document.getElementById("CUChart2-xs").getContext("2d");
var myNewChart2 = new Chart(ctx).Doughnut(!{JSON.stringify(Civil_Rights_and_Liberties_Data)}, !{JSON.stringify(SectionOptions)});

var ctx = document.getElementById("CUChart3-xs").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(!{JSON.stringify(Political_Beliefs_and_Behaviors_Data)}, !{JSON.stringify(SectionOptions)});

var ctx = document.getElementById("CUChart4-xs").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(!{JSON.stringify(Linkage_Institutions_Data)}, !{JSON.stringify(SectionOptions)});

var ctx = document.getElementById("CUChart5-xs").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(!{JSON.stringify(Public_Policy_Data)}, !{JSON.stringify(SectionOptions)});

var ctx = document.getElementById("CUChart6-xs").getContext("2d");
var myNewChart2 = new Chart(ctx).Doughnut(!{JSON.stringify(Institutions_of_National_Government_Data)}, !{JSON.stringify(SectionOptions)});