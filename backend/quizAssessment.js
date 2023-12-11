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
router.post('/', (req, res) => {
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

    // Store the quiz results
    const quizResult = {
        userAnswers,
        totalScore,
        skillLevel,
    };
    quizResults.push(quizResult);

    // Respond with the result
    res.json({ result: 'success', skillLevel });
});
module.exports = router;