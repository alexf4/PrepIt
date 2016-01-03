/**
 * Created by alexf4 on 6/9/15.
 */

var teacherFunctions = require("../DBWork/teacherFunctions");

var dataToChartHelper = require("../views/dataToChartHelper");

/**
 *
 * @param req
 * @param res
 */
exports.teacherPage = function(req, res ){

  //Get the users logged in id
  userId = req.session.passport.user;

  teacherFunctions.getStudentsMasterys(userId, function(scores){

    //TODO: Might have to switch this to a teacher chart later
    chartData = dataToChartHelper.createStudentMasteryChart(scores);

    teacherFunctions.getTeacherClassToken(userId, function(classToken){

      teacherFunctions.listStudents(classToken , function(students){

        //TODO: now you have students list "students"
        //TODO: Make this dynamic
        res.render("teacher", {totalData : chartData.totalData , totalOptions : chartData.totalOptions ,
          CUData : chartData.Constitutional_Underpinnings_Data, SectionOptions : chartData.sectionOptions,
          Civil_Rights_and_Liberties_Data : chartData.Civil_Rights_and_Liberties_Data,
          Political_Beliefs_and_Behaviors_Data : chartData.Political_Beliefs_and_Behaviors_Data,
          Linkage_Institutions_Data: chartData.Linkage_Institutions_Data,
          Institutions_of_National_Government_Data : chartData.Institutions_of_National_Government_Data,
          Public_Policy_Data : chartData.Public_Policy_Data, studentList : students
        });

      })

    })

  });

};

