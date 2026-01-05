// Missions data
const missions = [
    {
        id: 'basics',
        title: 'Read Beginner Badminton Basics',
        description: 'Learn the fundamental rules and court layout.',
        completed: false,
        unlocked: true
    },
    {
        id: 'equipment',
        title: 'Learn About Badminton Equipment',
        description: 'Discover the racket, shuttlecock, and other gear.',
        completed: false,
        unlocked: false
    },
    {
        id: 'serve',
        title: 'Practice Basic Serve Technique',
        description: 'Master the basic serve to start your game.',
        completed: false,
        unlocked: false
    },
    {
        id: 'quiz',
        title: 'Take a Beginner Quiz',
        description: 'Test your knowledge with a fun quiz.',
        completed: false,
        unlocked: false
    },
    {
        id: 'journey',
        title: 'Complete First Learning Journey',
        description: 'Finish all missions to complete your journey.',
        completed: false,
        unlocked: false
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
    updateUnlocks();
}

// Save missions to localStorage
function saveMissions() {
    const completedIds = missions.filter(m => m.completed).map(m => m.id);
    localStorage.setItem('badmintonMissions', JSON.stringify(completedIds));
}

// Update mission unlocks
function updateUnlocks() {
    missions.forEach((mission, index) => {
        if (index === 0) {
            mission.unlocked = true;
        } else {
            mission.unlocked = missions[index - 1].completed;
        }
    });
    if (missions.slice(0, 4).every(m => m.completed)) {
        missions[4].unlocked = true;
    }
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
        showCoachFeedback('Great job! You\'ve completed your first learning journey 🏸');
    }
}

// Render mission cards
function renderMissions() {
    const container = document.getElementById('mission-cards');
    container.innerHTML = '';

    missions.forEach((mission, index) => {
        const card = document.createElement('div');
        card.className = `mission-card ${mission.completed ? 'completed' : (mission.unlocked ? 'in-progress' : '')}`;

        const status = mission.completed ? '✅' : (mission.unlocked ? '⏳' : '🔒');

        card.innerHTML = `
            <h3>${mission.title} <span class="status">${status}</span></h3>
            <p>${mission.description}</p>
            <button onclick="startMission(${index})" ${mission.completed || !mission.unlocked ? 'disabled' : ''}>
                ${mission.completed ? 'Completed' : 'Start Mission'}
            </button>
        `;

        container.appendChild(card);
    });
}

// Start mission
function startMission(index) {
    const mission = missions[index];
    if (mission.completed || !mission.unlocked) return;

    switch (mission.id) {
        case 'basics':
            openBasicsModal();
            break;
        case 'equipment':
            openEquipmentModal();
            break;
        case 'serve':
            openServeModal();
            break;
        case 'quiz':
            switchToQuiz();
            break;
    }
}

// Complete mission
function completeMission(index, showFeedback = true) {
    if (missions[index].completed) return;

    missions[index].completed = true;
    saveMissions();
    updateUnlocks();
    renderMissions();
    updateProgress();

    if (showFeedback) {
        let feedback = '';
        switch (missions[index].id) {
            case 'basics':
                feedback = 'Great job reading the basics! You\'re on your way to becoming a badminton pro. 🏸';
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
        showCoachFeedback(feedback);
    }
}

// Show coach feedback
function showCoachFeedback(message) {
    const feedbackDiv = document.getElementById('coach-feedback');
    feedbackDiv.textContent = message;
    feedbackDiv.classList.add('show');
    setTimeout(() => {
        feedbackDiv.classList.remove('show');
    }, 5000);
}

// Modal functions
function openBasicsModal() {
    const modal = document.getElementById('basics-modal');
    modal.style.display = 'block';
    document.getElementById('mark-read-btn').disabled = true;

    const content = document.getElementById('basics-content');
    content.scrollTop = 0;

    content.addEventListener('scroll', function() {
        if (content.scrollTop + content.clientHeight >= content.scrollHeight - 10) {
            document.getElementById('mark-read-btn').disabled = false;
        }
    });
}

function openEquipmentModal() {
    const modal = document.getElementById('equipment-modal');
    modal.style.display = 'block';
    document.getElementById('complete-equipment-btn').disabled = true;

    const learnedItems = new Set();

    document.querySelectorAll('.learn-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.parentElement.dataset.item;
            const info = document.getElementById(`${item}-info`);
            info.style.display = info.style.display === 'none' ? 'block' : 'none';
            learnedItems.add(item);

            if (learnedItems.size === 3) {
                document.getElementById('complete-equipment-btn').disabled = false;
            }
        });
    });
}

function openServeModal() {
    const modal = document.getElementById('serve-modal');
    modal.style.display = 'block';
    document.getElementById('complete-serve-btn').disabled = true;

    const checkboxes = document.querySelectorAll('#serve-steps input');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            document.getElementById('complete-serve-btn').disabled = !allChecked;
        });
    });
}

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Modal action buttons
document.getElementById('mark-read-btn').addEventListener('click', function() {
    completeMission(0);
    document.getElementById('basics-modal').style.display = 'none';
});

document.getElementById('complete-equipment-btn').addEventListener('click', function() {
    completeMission(1);
    document.getElementById('equipment-modal').style.display = 'none';
});

document.getElementById('complete-serve-btn').addEventListener('click', function() {
    completeMission(2);
    document.getElementById('serve-modal').style.display = 'none';
});

// Navigation
document.getElementById('dashboard-btn').addEventListener('click', () => {
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('ai-quiz').classList.remove('active');
    document.getElementById('coach-chat').classList.remove('active');
    document.getElementById('dashboard-btn').classList.add('active');
    document.getElementById('quiz-btn').classList.remove('active');
    document.getElementById('coach-btn').classList.remove('active');
});

document.getElementById('quiz-btn').addEventListener('click', () => {
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('ai-quiz').classList.add('active');
    document.getElementById('coach-chat').classList.remove('active');
    document.getElementById('dashboard-btn').classList.remove('active');
    document.getElementById('quiz-btn').classList.add('active');
    document.getElementById('coach-btn').classList.remove('active');
});

document.getElementById('coach-btn').addEventListener('click', () => {
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('ai-quiz').classList.remove('active');
    document.getElementById('coach-chat').classList.add('active');
    document.getElementById('dashboard-btn').classList.remove('active');
    document.getElementById('quiz-btn').classList.remove('active');
    document.getElementById('coach-btn').classList.add('active');
});

function switchToQuiz() {
    document.getElementById('dashboard-btn').click();
    setTimeout(() => {
        document.getElementById('quiz-btn').click();
    }, 100);
}

// Quiz functionality
let quizQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;

function generateQuiz() {
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
                },
                {
                    question: 'How many players are on a badminton court for doubles?',
                    options: ['2', '4', '6', '8'],
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
                },
                {
                    question: 'What type of shoes are recommended for badminton?',
                    options: ['Running shoes', 'Badminton shoes', 'Basketball shoes', 'Tennis shoes'],
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
                },
                {
                    question: 'What should be the position of the shuttle during a serve?',
                    options: ['Above head', 'At eye level', 'Below waist', 'At shoulder height'],
                    correct: 2
                }
            ]
        }
    ];

    quizQuestions = [];
    const selectedTopics = topics.sort(() => 0.5 - Math.random()).slice(0, 3);
    selectedTopics.forEach(topic => {
        const q = topic.questions[Math.floor(Math.random() * topic.questions.length)];
        quizQuestions.push(q);
    });
}

function startQuiz() {
    generateQuiz();
    currentQuestionIndex = 0;
    quizScore = 0;
    document.getElementById('start-quiz-btn').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById('current-question').textContent = `${currentQuestionIndex + 1}. ${q.question}`;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `${index + 1}. ${option}`;
        btn.addEventListener('click', () => selectAnswer(index));
        optionsDiv.appendChild(btn);
    });
    
    document.getElementById('next-btn').style.display = 'none';
}

function selectAnswer(selectedIndex) {
    const q = quizQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === q.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === q.correct) {
        quizScore++;
    }
    
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    document.getElementById('quiz-questions').style.display = 'none';
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.style.display = 'block';
    
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    let feedback = `Quiz complete! You scored ${quizScore}/${quizQuestions.length} (${percentage}%). `;
    if (percentage >= 75) {
        feedback += 'Fantastic job! You\'re a natural. 🏸';
    } else if (percentage >= 50) {
        feedback += 'Good effort! Keep practicing and you\'ll improve quickly. 💪';
    } else {
        feedback += 'Don\'t worry, badminton takes time. Let\'s review the basics again! 📚';
    }
    
    resultsDiv.innerHTML = `<h3>${feedback}</h3><button onclick="resetQuiz()">Take Quiz Again</button>`;
    
    // Complete quiz mission
    if (!missions[3].completed) {
        completeMission(3);
    }
}

function resetQuiz() {
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('start-quiz-btn').style.display = 'block';
}

// Event listeners
document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);

// Initialize
loadMissions();
renderMissions();
updateProgress();