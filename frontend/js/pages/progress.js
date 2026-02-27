const progressData = JSON.parse(localStorage.getItem("progressData")) || [];

/* =========================
   ANALYTICS ENGINE
========================= */

function buildAnalytics(data) {

    if (data.length === 0) {
        return null;
    }

    const analytics = {
        totalAttempts: data.length,
        overallAccuracy: 0,
        subjectStats: {},
        chapterStats: {},
        streak: 0,
        inactiveChapters: [],
        weakestChaptersThisWeek: [],
        trendData: {},
        lastAttemptDate: null,
        daysSinceLastAttempt: 0,
        isGloballyInactive: false
    };

    let totalScore = 0;
    let totalQuestions = 0;

    const today = new Date();

    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);

    const last14Days = new Date(today);
    last14Days.setDate(today.getDate() - 14);

    const chapterLastAttempt = {};

    /* =========================
       MAIN AGGREGATION LOOP
    ========================= */

    data.forEach(entry => {

        const entryDate = new Date(entry.date);

        totalScore += entry.score;
        totalQuestions += entry.total;

        /* -------- SUBJECT -------- */
        if (!analytics.subjectStats[entry.subject]) {
            analytics.subjectStats[entry.subject] = { score: 0, total: 0 };
        }

        analytics.subjectStats[entry.subject].score += entry.score;
        analytics.subjectStats[entry.subject].total += entry.total;

        /* -------- CHAPTER -------- */
        const chapterKey = `${entry.subject}__${entry.chapter}`;

        if (!analytics.chapterStats[chapterKey]) {
            analytics.chapterStats[chapterKey] = {
                subject: entry.subject,
                chapter: entry.chapter,
                attempts: 0,
                score: 0,
                total: 0
            };
        }

        analytics.chapterStats[chapterKey].attempts += 1;
        analytics.chapterStats[chapterKey].score += entry.score;
        analytics.chapterStats[chapterKey].total += entry.total;

        /* -------- LAST ATTEMPT -------- */
        chapterLastAttempt[chapterKey] = entryDate;

        /* -------- TREND (DAILY) -------- */
        const dayKey = entryDate.toISOString().split("T")[0];

        if (!analytics.trendData[dayKey]) {
            analytics.trendData[dayKey] = { score: 0, total: 0 };
        }

        analytics.trendData[dayKey].score += entry.score;
        analytics.trendData[dayKey].total += entry.total;
    });

    analytics.overallAccuracy = ((totalScore / totalQuestions) * 100).toFixed(2);

    /* =========================
       GLOBAL INACTIVITY
    ========================= */

    const sortedByDate = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    const lastAttemptDate = new Date(sortedByDate[0].date);

    const diffTime = today - lastAttemptDate;
    const daysSinceLastAttempt = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    analytics.lastAttemptDate = lastAttemptDate;
    analytics.daysSinceLastAttempt = daysSinceLastAttempt;
    analytics.isGloballyInactive = daysSinceLastAttempt >= 14;

    /* =========================
       STREAK
    ========================= */

    const uniqueDays = [...new Set(data.map(d =>
        new Date(d.date).toISOString().split("T")[0]
    ))].sort().reverse();

    let streak = 0;
    let checkDate = new Date();

    for (let day of uniqueDays) {
        const formatted = checkDate.toISOString().split("T")[0];
        if (day === formatted) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    analytics.streak = streak;

    /* =========================
       INACTIVE CHAPTERS (14 DAYS)
    ========================= */

    for (let key in chapterLastAttempt) {
        if (chapterLastAttempt[key] < last14Days) {
            analytics.inactiveChapters.push(analytics.chapterStats[key]);
        }
    }

    /* =========================
       WEAKEST CHAPTERS (LAST 7 DAYS)
    ========================= */

    const weeklyStats = {};

    data.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= last7Days) {

            const key = `${entry.subject}__${entry.chapter}`;

            if (!weeklyStats[key]) {
                weeklyStats[key] = {
                    subject: entry.subject,
                    chapter: entry.chapter,
                    score: 0,
                    total: 0
                };
            }

            weeklyStats[key].score += entry.score;
            weeklyStats[key].total += entry.total;
        }
    });

    const weeklyArray = Object.values(weeklyStats).map(ch => ({
        ...ch,
        accuracy: (ch.score / ch.total) * 100
    }));

    weeklyArray.sort((a, b) => a.accuracy - b.accuracy);

    analytics.weakestChaptersThisWeek = weeklyArray.slice(0, 3);

    return analytics;
}

/* =========================
   RUN ENGINE
========================= */

const analytics = buildAnalytics(progressData);

/* =========================
   UI RENDERING
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const loadingState = document.getElementById("loading-state");
    const emptyState = document.getElementById("empty-state");
    const dashboardGrid = document.getElementById("dashboard-grid");

    loadingState.classList.add("hidden");

    if (!analytics) {
        emptyState.classList.remove("hidden");
        return;
    }

    dashboardGrid.classList.remove("hidden");

    // 1. Summary Stats
    document.getElementById("val-attempts").textContent = analytics.totalAttempts;
    document.getElementById("val-accuracy").textContent = analytics.overallAccuracy + "%";
    document.getElementById("val-streak").textContent = analytics.streak + " day(s)";

    // 2. Alert Card (Top Weakness or Revision)
    const alertContent = document.getElementById("alert-content");
    const alertCard = document.getElementById("card-alert");

    if (analytics.isGloballyInactive) {
        alertCard.classList.add("danger");
        alertContent.innerHTML = `
            <div class="alert-icon">⚠️</div>
            <div class="alert-text">
                <span class="alert-title">Critical Revision Needed</span>
                <span class="alert-desc">You have been inactive for ${analytics.daysSinceLastAttempt} days. It's time to get back on track!</span>
            </div>
        `;
    } else if (analytics.topWeakness) {
        alertCard.classList.add("warning");
        alertContent.innerHTML = `
            <div class="alert-icon">📉</div>
            <div class="alert-text">
                <span class="alert-title">Accuracy Dropped</span>
                <span class="alert-desc">You are struggling with <strong>"${analytics.topWeakness.chapter}"</strong> (${analytics.topWeakness.subject}). Accuracy dropped by ${analytics.topWeakness.drop.toFixed(2)}% this week.</span>
            </div>
        `;
    } else {
        alertCard.classList.add("success");
        alertContent.innerHTML = `
            <div class="alert-icon">🌟</div>
            <div class="alert-text">
                <span class="alert-title">On Track!</span>
                <span class="alert-desc">You're making consistent progress. Keep reinforcing recent topics.</span>
            </div>
        `;
    }

    // 3. Subject Mastery Bars
    const subjectBarsContainer = document.getElementById("subject-bars-container");
    for (let subject in analytics.subjectStats) {
        const s = analytics.subjectStats[subject];
        const accuracy = ((s.score / s.total) * 100).toFixed(0);

        let barColorClass = "green";
        if (accuracy < 50) barColorClass = "red";
        else if (accuracy < 80) barColorClass = "yellow";

        subjectBarsContainer.innerHTML += `
            <div class="mastery-item">
                <div class="mastery-header">
                    <span class="mastery-subject">${subject}</span>
                    <span class="mastery-acc">${accuracy}%</span>
                </div>
                <div class="mastery-track">
                    <div class="mastery-fill ${barColorClass}" style="width: ${accuracy}%"></div>
                </div>
            </div>
        `;
    }

    // 4. Focus & Revision Lists
    const focusList = document.getElementById("focus-list");
    if (analytics.weakestChaptersThisWeek.length === 0) {
        focusList.innerHTML = `<div class="empty-list">No recent data for this week.</div>`;
    } else {
        analytics.weakestChaptersThisWeek.forEach(ch => {
            focusList.innerHTML += `
                <div class="list-item">
                    <div class="list-dot warning"></div>
                    <div class="list-text">
                        <span class="list-title">${ch.chapter}</span>
                        <span class="list-subtitle">${ch.subject} • ${ch.accuracy.toFixed(0)}%</span>
                    </div>
                </div>
            `;
        });
    }

    const revisionList = document.getElementById("revision-list");
    if (analytics.inactiveChapters.length === 0) {
        revisionList.innerHTML = `<div class="empty-list">All chapters are fresh in memory!</div>`;
    } else {
        analytics.inactiveChapters.slice(0, 5).forEach(ch => { // Show max 5
            revisionList.innerHTML += `
                <div class="list-item">
                    <div class="list-dot danger"></div>
                    <div class="list-text">
                        <span class="list-title">${ch.chapter}</span>
                        <span class="list-subtitle">${ch.subject} • Last attempt >14 days ago</span>
                    </div>
                </div>
            `;
        });
    }

    // 5. Heatmap
    const heatmapDiv = document.getElementById("heatmap");
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dayKey = day.toISOString().split("T")[0];

        const count = progressData.filter(e =>
            new Date(e.date).toISOString().split("T")[0] === dayKey
        ).length;

        let level = 0;
        if (count === 1) level = 1;
        else if (count === 2) level = 2;
        else if (count >= 3) level = 3;

        heatmapDiv.innerHTML += `
            <div class="heat-cell level-${level}" title="${dayKey}: ${count} quizzes"></div>
        `;
    }

    // 6. Chapter Breakdown Table
    const tbody = document.getElementById("chapter-tbody");
    Object.values(analytics.chapterStats).forEach(ch => {
        const accuracy = ((ch.score / ch.total) * 100).toFixed(0);

        let badgeClass = "badge-beginner";
        let level = "Beginner";
        if (accuracy >= 80) {
            level = "Expert";
            badgeClass = "badge-expert";
        } else if (accuracy >= 50) {
            level = "Intermediate";
            badgeClass = "badge-intermediate";
        }

        tbody.innerHTML += `
            <tr>
                <td>${ch.subject}</td>
                <td class="fw-500">${ch.chapter}</td>
                <td>${ch.attempts}</td>
                <td>
                    <div class="table-acc">
                        <span>${accuracy}%</span>
                        <div class="mini-bar-track"><div class="mini-bar-fill" style="width: ${accuracy}%"></div></div>
                    </div>
                </td>
                <td><span class="badge ${badgeClass}">${level}</span></td>
            </tr>
        `;
    });

    // 7. Charts
    Chart.defaults.color = "#4b5563";
    Chart.defaults.font.family = "Arial, Helvetica, sans-serif";

    // Trend Chart
    if (Object.keys(analytics.trendData).length > 0) {
        const dates = Object.keys(analytics.trendData).sort();
        const mathData = [];
        const physicsData = [];
        const chemistryData = [];

        dates.forEach(date => {
            const dailyEntries = progressData.filter(e =>
                new Date(e.date).toISOString().split("T")[0] === date
            );

            let mathScore = 0, mathTotal = 0;
            let phyScore = 0, phyTotal = 0;
            let chemScore = 0, chemTotal = 0;

            dailyEntries.forEach(e => {
                if (e.subject === "Mathematics") {
                    mathScore += e.score;
                    mathTotal += e.total;
                }
                if (e.subject === "Physics") {
                    phyScore += e.score;
                    phyTotal += e.total;
                }
                if (e.subject === "Chemistry") {
                    chemScore += e.score;
                    chemTotal += e.total;
                }
            });

            mathData.push(mathTotal ? (mathScore / mathTotal) * 100 : null);
            physicsData.push(phyTotal ? (phyScore / phyTotal) * 100 : null);
            chemistryData.push(chemTotal ? (chemScore / chemTotal) * 100 : null);
        });

        const shortDates = dates.map(d => {
            const dateObj = new Date(d);
            return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        new Chart(document.getElementById("trendChart"), {
            type: "line",
            data: {
                labels: shortDates,
                datasets: [
                    {
                        label: "Mathematics",
                        data: mathData,
                        borderColor: "#3b82f6", // Blue
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderWidth: 2,
                        tension: 0.1,
                        fill: true,
                        pointBackgroundColor: "#ffffff",
                        pointBorderColor: "#3b82f6",
                        pointBorderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: "Physics",
                        data: physicsData,
                        borderColor: "#ef4444", // Red
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        borderWidth: 2,
                        tension: 0.1,
                        fill: true,
                        pointBackgroundColor: "#ffffff",
                        pointBorderColor: "#ef4444",
                        pointBorderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: "Chemistry",
                        data: chemistryData,
                        borderColor: "#10b981", // Emerald
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        borderWidth: 2,
                        tension: 0.1,
                        fill: true,
                        pointBackgroundColor: "#ffffff",
                        pointBorderColor: "#10b981",
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: "top",
                        labels: { usePointStyle: true, boxWidth: 6, padding: 20 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        boxPadding: 4
                    }
                },
                scales: {
                    x: {
                        grid: { color: "rgba(0,0,0,0.05)", drawBorder: false }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
                        ticks: { callback: function (value) { return value + "%" } }
                    }
                }
            }
        });
    }

    // Pie Chart
    if (analytics) {
        const subjects = Object.keys(analytics.subjectStats);
        const subjectAccuracy = subjects.map(subject => {
            const s = analytics.subjectStats[subject];
            return (s.score / s.total) * 100;
        });

        const colorMap = {
            "Mathematics": "#3b82f6",
            "Physics": "#ef4444",
            "Chemistry": "#10b981"
        };
        const bgColors = subjects.map(s => colorMap[s] || "#8b5cf6");

        new Chart(document.getElementById("subjectPieChart"), {
            type: "doughnut",
            data: {
                labels: subjects,
                datasets: [{
                    data: subjectAccuracy,
                    backgroundColor: bgColors,
                    borderColor: "#ffffff",
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, boxWidth: 8, padding: 20 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function (context) {
                                return ' ' + context.label + ': ' + Math.round(context.raw) + '%';
                            }
                        }
                    }
                }
            }
        });
    }
});
