const express = require('express');
const router = express.Router();

router.use(express.json());


// In-memory storage for quiz results
let quizResults = [];


/**
 * @swagger
 * /quiz:
 *   post:
 *     summary: Submit quiz answers and get skill level
 *     tags: [QuizAssessment]
 *     parameters:
 *       - name: userAnswers
 *         in: body
 *         description: The quiz answers of the user.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userAnswers:
 *               type: array
 *               items:
 *                 type: integer
 *               example: [1, 2, 3, 2, 1, 3, 2, 1, 3, 2]
 *         default: {"userAnswers": [1, 2, 3, 2, 1, 3, 2, 1, 3, 2]}
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               result: success
 *               skillLevel: Advanced
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Please provide valid user answers
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */
router.put('/:userID', (req, res) => {
    const userID = req.params.userID;
    const userAnswers = req.body.userAnswers;

    // Calculate total score
    const totalScore = userAnswers.reduce((acc, val) => acc + val, 0);

    // Determine skill level based on the total score
    let skillLevel;
    if (totalScore <= 15) {
        skillLevel = "Beginner";
    } else if (totalScore >= 25) {
        skillLevel = "Intermediate";
    } else {
        skillLevel = "Advanced";
    }
    const sqlQuery = `UPDATE BudgetBytesTable SET skillLevel = @skillLevel WHERE userLogID = @userLogID`;
    const sqlRequest = dbConnection.request();
    sqlRequest.input('userLogID', userID);
    sqlRequest.input('skillLevel', skillLevel);
    sqlRequest.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err);
            return response.status(400).json({ Error: "Skill level was not updated." });
        } else {
            console.log("OK");
            return response.status(200).json({ Success: "Skill level was updated!" });
        }
    });
    
});

module.exports = router;
