// Missions data
const missions = [
    {
        id: 'basics',
        title: 'Read Beginner Badminton Basics',
        description: 'Learn the fundamental rules and court layout.',
        completed: false
    },
    {
        id: 'equipment',
        title: 'Learn About Badminton Equipment',
        description: 'Discover the racket, shuttlecock, and other gear.',
        completed: false
    },
    {
        id: 'serve',
        title: 'Practice Basic Serve Technique',
        description: 'Master the basic serve to start your game.',
        completed: false
    },
    {
        id: 'quiz',
        title: 'Take a Beginner Quiz',
        description: 'Test your knowledge with a fun quiz.',
        completed: false
    },
    {
        id: 'journey',
        title: 'Complete First Learning Journey',
        description: 'Finish all missions to complete your journey.',
        completed: false
    }
];

// Load missions from localStorage
function loadMissions() {
    const stored = localStorage.getItem('badmintonMissions');
    if (stored) {
        const completedIds = JSON.parse(stored);
        missions.forEach(mission => {
            mission.completed = completedIds.includes(mission.id);
        });
    }
}

// Save missions to localStorage
function saveMissions() {
    const completedIds = missions.filter(m => m.completed).map(m => m.id);
    localStorage.setItem('badmintonMissions', JSON.stringify(completedIds));
}

// Update progress
function updateProgress() {
    const completed = missions.filter(m => m.completed).length;
    const total = missions.length;
    const percentage = (completed / total) * 100;

    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${completed} / ${total} missions completed`;

    // Check if all missions completed
    if (completed === total && !missions[4].completed) {
        missions[4].completed = true;
        saveMissions();
        renderMissions();
        showFeedback('Congratulations! You\'ve completed your first learning journey! 🎉');
    }
}

// Render mission cards
function renderMissions() {
    const container = document.getElementById('mission-cards');
    container.innerHTML = '';

    missions.forEach((mission, index) => {
        const card = document.createElement('div');
        card.className = `mission-card ${mission.completed ? 'completed' : (index === 0 || missions[index - 1].completed) ? 'in-progress' : ''}`;

        const status = mission.completed ? '✅' : (index === 0 || missions[index - 1].completed) ? '⏳' : '🔒';

        card.innerHTML = `
            <h3>${mission.title} <span class="status">${status}</span></h3>
            <p>${mission.description}</p>
            <button onclick="completeMission(${index})" ${mission.completed ? 'disabled' : ''}>
                ${mission.completed ? 'Completed' : 'Complete Mission'}
            </button>
        `;

        container.appendChild(card);
    });
}

// Complete mission
function completeMission(index) {
    if (missions[index].completed) return;

    missions[index].completed = true;
    saveMissions();
    renderMissions();
    updateProgress();

    const mission = missions[index];
    let feedback = '';
    switch (mission.id) {
        case 'basics':
            feedback = 'Great job learning the basics! You\'re on your way to becoming a badminton pro. 🏸';
            break;
        case 'equipment':
            feedback = 'Excellent! Knowing your equipment is key to playing well. Keep it up! 💪';
            break;
        case 'serve':
            feedback = 'Awesome serve practice! Consistency is everything in badminton. 🌟';
            break;
        case 'quiz':
            feedback = 'Quiz completed! You\'re absorbing knowledge like a champion. 🏆';
            break;
        case 'journey':
            feedback = 'Journey complete! You\'re now a certified beginner badminton learner! 🎊';
            break;
    }
    showFeedback(feedback);
}

// Show feedback
function showFeedback(message) {
    // Simple alert for now, could be enhanced with a modal
    alert(message);
}

// Navigation
document.getElementById('dashboard-btn').addEventListener('click', () => {
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('coach-chat').classList.remove('active');
    document.getElementById('dashboard-btn').classList.add('active');
    document.getElementById('coach-btn').classList.remove('active');
});

document.getElementById('coach-btn').addEventListener('click', () => {
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('coach-chat').classList.add('active');
    document.getElementById('dashboard-btn').classList.remove('active');
    document.getElementById('coach-btn').classList.add('active');
    startQuizIfNeeded();
});

// Chatbot functionality
let quizActive = false;
let currentQuestionIndex = 0;
let quizQuestions = [];
let score = 0;

function startQuizIfNeeded() {
    if (!missions[3].completed && !quizActive) {
        quizActive = true;
        generateQuiz();
        addMessage('coach', 'Hey there! Ready for your beginner badminton quiz? Let\'s test what you\'ve learned. I\'ll ask you 4 questions. Choose the best answer!');
        askQuestion();
    }
}

function generateQuiz() {
    // Dynamically generate questions based on topics
    const topics = [
        {
            topic: 'rules',
            questions: [
                {
                    question: 'How many points do you need to win a game in badminton?',
                    options: ['11', '15', '21', '25'],
                    correct: 2
                },
                {
                    question: 'What is the height of the net in badminton?',
                    options: ['1.5m', '1.52m', '1.55m', '1.6m'],
                    correct: 1
                }
            ]
        },
        {
            topic: 'equipment',
            questions: [
                {
                    question: 'What is the main striking implement in badminton?',
                    options: ['Bat', 'Racket', 'Paddle', 'Stick'],
                    correct: 1
                },
                {
                    question: 'What material is a shuttlecock traditionally made from?',
                    options: ['Plastic', 'Feathers', 'Rubber', 'Metal'],
                    correct: 1
                }
            ]
        },
        {
            topic: 'skills',
            questions: [
                {
                    question: 'What is the term for hitting the shuttlecock from below?',
                    options: ['Smash', 'Drop', 'Clear', 'Drive'],
                    correct: 0
                },
                {
                    question: 'Which foot should be forward when performing a forehand serve?',
                    options: ['Left', 'Right', 'Either', 'None'],
                    correct: 1
                }
            ]
        }
    ];

    quizQuestions = [];
    // Select 4 questions randomly from different topics
    const selectedTopics = topics.sort(() => 0.5 - Math.random()).slice(0, 4);
    selectedTopics.forEach(topic => {
        const q = topic.questions[Math.floor(Math.random() * topic.questions.length)];
        quizQuestions.push(q);
    });
}

function askQuestion() {
    if (currentQuestionIndex < quizQuestions.length) {
        const q = quizQuestions[currentQuestionIndex];
        let message = `${currentQuestionIndex + 1}. ${q.question}\n`;
        q.options.forEach((option, index) => {
            message += `${index + 1}. ${option}\n`;
        });
        message += 'Reply with the number of your choice!';
        addMessage('coach', message);
    } else {
        endQuiz();
    }
}

function addMessage(sender, text) {
    const messages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function endQuiz() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let feedback = `Quiz complete! You scored ${score}/${quizQuestions.length} (${percentage}%). `;
    if (percentage >= 75) {
        feedback += 'Fantastic job! You\'re a natural. 🏸';
    } else if (percentage >= 50) {
        feedback += 'Good effort! Keep practicing and you\'ll improve quickly. 💪';
    } else {
        feedback += 'Don\'t worry, badminton takes time. Let\'s review the basics again! 📚';
    }
    addMessage('coach', feedback);
    quizActive = false;
    // Complete quiz mission
    if (!missions[3].completed) {
        missions[3].completed = true;
        saveMissions();
        updateProgress();
        renderMissions();
    }
}

// Chat input handling
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        addMessage('user', message);
        input.value = '';

        if (quizActive) {
            handleQuizAnswer(message);
        } else {
            // General chat response
            addMessage('coach', 'I\'m here to help with your badminton learning! Check out the missions on the dashboard. 🏓');
        }
    }
}

function handleQuizAnswer(answer) {
    const choice = parseInt(answer) - 1;
    const q = quizQuestions[currentQuestionIndex];
    if (choice === q.correct) {
        addMessage('coach', 'Correct! Great job. 👍');
        score++;
    } else {
        addMessage('coach', `Not quite. The correct answer was: ${q.options[q.correct]}. Keep learning! 📖`);
    }
    currentQuestionIndex++;
    setTimeout(askQuestion, 1000);
}

// Initialize
loadMissions();
renderMissions();
updateProgress();