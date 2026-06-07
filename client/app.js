const API_BASE_URL = 'http://localhost:5000/api';

let state = {
    streams: [],
    subjects: [],
    students: [],
    scores: []
};

async function loadState() {
    try {
        const res1 = await fetch(API_BASE_URL + "/streams");
        state.streams = await res1.json();

        const res2 = await fetch(API_BASE_URL + "/subjects");
        state.subjects = await res2.json();

        const res3 = await fetch(API_BASE_URL + "/students");
        state.students = await res3.json();

        const res4 = await fetch(API_BASE_URL + "/scores");
        state.scores = await res4.json();
    } catch (err) {
        console.log("Error loading data", err);
    }
}

function getStudentAverage(studentId) {
    let total = 0;
    let count = 0;
    for (let i = 0; i < state.scores.length; i++) {
        const item = state.scores[i];
        const currentStudentId = item.student && item.student._id ? item.student._id : item.student;
        if (currentStudentId === studentId) {
            total = total + (item.examScore || 0) + (item.caScore || 0);
            count = count + 1;
        }
    }
    if (count === 0) {
        return 0;
    }
    return Math.round(total / count);
}

function getGrade(score) {
    if (score >= 80) return { letter: "A", class: "badge-success" };
    if (score >= 70) return { letter: "B", class: "badge-success" };
    if (score >= 60) return { letter: "C", class: "badge-info" };
    if (score >= 50) return { letter: "D", class: "badge-warning" };
    return { letter: "F", class: "badge-danger" };
}

function getSchoolAverage() {
    let total = 0;
    if (state.scores.length === 0) {
        return 0;
    }
    for (let i = 0; i < state.scores.length; i++) {
        const item = state.scores[i];
        total = total + (item.examScore || 0) + (item.caScore || 0);
    }
    return Math.round(total / state.scores.length);
}

function updateGlobalStats() {
    document.getElementById("stat-total-students").innerText = state.students.length;
    document.getElementById("stat-total-streams").innerText = state.streams.length;
    document.getElementById("stat-school-average").innerText = getSchoolAverage() + "%";
}

function populateDropdowns() {
    const ids = ["reg-stream", "student-stream", "filter-stream", "print-select-stream"];
    for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (el) {
            let html = "";
            if (el.options[0]) {
                html = el.options[0].outerHTML;
            }
            const isStreamPrintSelect = ids[i] === "print-select-stream";
            for (let j = 0; j < state.streams.length; j++) {
                const val = isStreamPrintSelect ? state.streams[j]._id : state.streams[j].name;
                html = html + "<option value='" + val + "'>" + state.streams[j].name + "</option>";
            }
            el.innerHTML = html;
        }
    }

    const studentSelect = document.getElementById("score-student");
    if (studentSelect) {
        let html = "<option value=''>Choose Student</option>";
        for (let i = 0; i < state.students.length; i++) {
            html = html + "<option value='" + state.students[i]._id + "'>" + state.students[i].name + "</option>";
        }
        studentSelect.innerHTML = html;
    }

    const printStudentSelect = document.getElementById("print-select-student");
    if (printStudentSelect) {
        let html = "<option value=''>Choose Student</option>";
        for (let i = 0; i < state.students.length; i++) {
            html = html + "<option value='" + state.students[i]._id + "'>" + state.students[i].name + "</option>";
        }
        printStudentSelect.innerHTML = html;
    }

    const subjectSelect = document.getElementById("score-subject");
    if (subjectSelect) {
        let html = "<option value=''>Choose Subject</option>";
        for (let i = 0; i < state.subjects.length; i++) {
            html = html + "<option value='" + state.subjects[i]._id + "'>" + state.subjects[i].name + "</option>";
        }
        subjectSelect.innerHTML = html;
    }
}

function renderDashboard() {
    const list = document.getElementById("top-students-list");
    if (!list) return;

    const ranked = [];
    for (let i = 0; i < state.students.length; i++) {
        const s = state.students[i];
        const avg = getStudentAverage(s._id);
        const grade = getGrade(avg);
        const streamName = s.stream && s.stream.name ? s.stream.name : "Unassigned";
        ranked.push({ id: s._id, name: s.name, stream: streamName, avg: avg, grade: grade });
    }

    ranked.sort(function (a, b) {
        return b.avg - a.avg;
    });

    let html = "";
    const limit = Math.min(ranked.length, 5);
    for (let i = 0; i < limit; i++) {
        const s = ranked[i];
        html = html + "<tr>" +
            "<td><strong>" + (i + 1) + "</strong></td>" +
            "<td>" + s.name + "</td>" +
            "<td><span class='badge badge-info'>" + s.stream + "</span></td>" +
            "<td><strong>" + s.avg + "%</strong></td>" +
            "<td><span class='badge " + s.grade.class + "'>" + s.grade.letter + "</span></td>" +
            "</tr>";
    }
    list.innerHTML = html;
}

function renderStreams() {
    const list = document.getElementById("streams-table-body");
    if (!list) return;

    let html = "";
    for (let i = 0; i < state.streams.length; i++) {
        const stream = state.streams[i];
        let count = 0;
        let total = 0;
        let scoresCount = 0;

        for (let j = 0; j < state.students.length; j++) {
            const student = state.students[j];
            const streamId = student.stream && student.stream._id ? student.stream._id : student.stream;
            if (streamId === stream._id) {
                count = count + 1;
                for (let k = 0; k < state.scores.length; k++) {
                    const scoreItem = state.scores[k];
                    const currentStudentId = scoreItem.student && scoreItem.student._id ? scoreItem.student._id : scoreItem.student;
                    if (currentStudentId === student._id) {
                        total = total + (scoreItem.examScore || 0) + (scoreItem.caScore || 0);
                        scoresCount = scoresCount + 1;
                    }
                }
            }
        }

        let avg = "N/A";
        if (scoresCount > 0) {
            avg = Math.round(total / scoresCount) + "%";
        }

        html = html + "<tr>" +
            "<td><strong>" + stream.name + "</strong></td>" +
            "<td>Assigned Instructor</td>" +
            "<td>" + count + " Students</td>" +
            "<td><strong>" + avg + "</strong></td>" +
            "<td>" +
            "<button class='btn btn-secondary btn-sm' style='margin-right:6px;' onclick='printClassReport(\"" + stream._id + "\")' title='Print Class Report'><i class='material-icons-round' style='font-size:16px; color: var(--primary);'>picture_as_pdf</i></button>" +
            "<button class='btn btn-secondary btn-sm' onclick='deleteStream(\"" + stream._id + "\")'><i class='material-icons-round' style='font-size:16px; color: var(--danger);'>delete</i></button>" +
            "</td>" +
            "</tr>";
    }
    list.innerHTML = html;
}

function renderStudents() {
    const list = document.getElementById("students-table-body");
    if (!list) return;

    const query = document.getElementById("student-search").value.toLowerCase();
    const filter = document.getElementById("filter-stream");
    const filterVal = filter ? filter.value : "";

    let html = "";
    let found = 0;

    for (let i = 0; i < state.students.length; i++) {
        const s = state.students[i];
        const streamName = s.stream && s.stream.name ? s.stream.name : "Unassigned";

        const matchSearch = s.name.toLowerCase().indexOf(query) !== -1 || s._id.toLowerCase().indexOf(query) !== -1;
        const matchStream = filterVal === "" || streamName === filterVal;

        if (matchSearch && matchStream) {
            found = found + 1;
            const avg = getStudentAverage(s._id);
            const grade = getGrade(avg);
            let statusClass = "badge-danger";
            let statusLabel = "Needs Review";
            if (avg >= 50) {
                statusClass = "badge-success";
                statusLabel = "Passing";
            }

            html = html + "<tr>" +
                "<td><code>" + s._id.slice(-6).toUpperCase() + "</code></td>" +
                "<td><strong>" + s.name + "</strong></td>" +
                "<td>" + streamName + "</td>" +
                "<td><strong>" + (avg > 0 ? avg + "%" : "N/A") + "</strong></td>" +
                "<td><span class='badge " + statusClass + "'>" + statusLabel + "</span></td>" +
                "<td>" +
                "<button class='btn btn-secondary btn-sm' style='margin-right:6px;' onclick='printStudentReport(\"" + s._id + "\")' title='Print Report Card'><i class='material-icons-round' style='font-size:16px; color: var(--primary);'>picture_as_pdf</i></button>" +
                "<button class='btn btn-secondary btn-sm' onclick='deleteStudent(\"" + s._id + "\")'><i class='material-icons-round' style='font-size:16px; color: var(--danger);'>delete</i></button>" +
                "</td>" +
                "</tr>";
        }
    }

    if (found === 0) {
        list.innerHTML = "<tr><td colspan='6' style='text-align: center; color: var(--text-muted);'>No students found.</td></tr>";
        return;
    }
    list.innerHTML = html;
}

function renderSubjects() {
    const list = document.getElementById("subjects-table-body");
    if (!list) return;

    let html = "";
    for (let i = 0; i < state.subjects.length; i++) {
        const sub = state.subjects[i];
        let count = 0;
        for (let j = 0; j < state.scores.length; j++) {
            const scoreItem = state.scores[j];
            const currentSubId = scoreItem.subject && scoreItem.subject._id ? scoreItem.subject._id : scoreItem.subject;
            if (currentSubId === sub._id) {
                count = count + 1;
            }
        }

        html = html + "<tr>" +
            "<td><strong>" + sub.name + "</strong></td>" +
            "<td>" + (sub.code || "N/A") + "</td>" +
            "<td>Assigned Instructor</td>" +
            "<td><span class='badge badge-info'>" + count + " Graded</span></td>" +
            "</tr>";
    }
    list.innerHTML = html;
}

function renderScoresView() {
    const list = document.getElementById("scores-table-body");
    if (!list) return;

    let html = "";
    const listScores = [];
    for (let i = 0; i < state.scores.length; i++) {
        listScores.push(state.scores[i]);
    }
    listScores.reverse();

    const limit = Math.min(listScores.length, 10);
    for (let i = 0; i < limit; i++) {
        const item = listScores[i];
        const studentId = item.student && item.student._id ? item.student._id : item.student;
        const subjectId = item.subject && item.subject._id ? item.subject._id : item.subject;

        let studentName = "Unknown Student";
        for (let j = 0; j < state.students.length; j++) {
            if (state.students[j]._id === studentId) {
                studentName = state.students[j].name;
                break;
            }
        }

        let subjectName = "Unknown Subject";
        for (let j = 0; j < state.subjects.length; j++) {
            if (state.subjects[j]._id === subjectId) {
                subjectName = state.subjects[j].name;
                break;
            }
        }

        const scoreVal = (item.examScore || 0) + (item.caScore || 0);
        const grade = getGrade(scoreVal);
        const dateString = item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now";

        html = html + "<tr>" +
            "<td><strong>" + studentName + "</strong></td>" +
            "<td>" + subjectName + "</td>" +
            "<td><strong>" + scoreVal + "%</strong></td>" +
            "<td><span class='badge " + grade.class + "'>" + grade.letter + "</span></td>" +
            "<td style='font-size: 12px; color: var(--text-muted);'>" + dateString + "</td>" +
            "</tr>";
    }
    list.innerHTML = html;
}

function renderResults() {
    const container1 = document.getElementById("subject-performance-bars");
    if (container1) {
        container1.innerHTML = "";
        for (let i = 0; i < state.subjects.length; i++) {
            const sub = state.subjects[i];
            let total = 0;
            let count = 0;
            for (let j = 0; j < state.scores.length; j++) {
                const item = state.scores[j];
                const subjectId = item.subject && item.subject._id ? item.subject._id : item.subject;
                if (subjectId === sub._id) {
                    total = total + (item.examScore || 0) + (item.caScore || 0);
                    count = count + 1;
                }
            }
            let avg = 0;
            if (count > 0) {
                avg = Math.round(total / count);
            }
            container1.innerHTML = container1.innerHTML +
                '<div class="chart-bar-item">' +
                '<div class="chart-bar-label"><span>' + sub.name + '</span><strong>' + avg + '%</strong></div>' +
                '<div class="chart-bar-track"><div class="chart-bar-fill" style="width: ' + avg + '%;"></div></div>' +
                '</div>';
        }
    }

    const container2 = document.getElementById("grade-distribution-bars");
    if (container2) {
        container2.innerHTML = "";
        const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
        for (let i = 0; i < state.students.length; i++) {
            const avg = getStudentAverage(state.students[i]._id);
            const letter = getGrade(avg).letter;
            dist[letter] = dist[letter] + 1;
        }

        let max = 1;
        const keys = Object.keys(dist);
        for (let i = 0; i < keys.length; i++) {
            if (dist[keys[i]] > max) {
                max = dist[keys[i]];
            }
        }

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const count = dist[key];
            const pct = Math.round((count / max) * 100);
            container2.innerHTML = container2.innerHTML +
                '<div class="chart-bar-item">' +
                '<div class="chart-bar-label"><span>Grade ' + key + '</span><strong>' + count + ' Students</strong></div>' +
                '<div class="chart-bar-track"><div class="chart-bar-fill" style="width: ' + pct + '%;"></div></div>' +
                '</div>';
        }
    }
}

function switchTab(tab) {
    const items = document.querySelectorAll(".nav-list .nav-item");
    for (let i = 0; i < items.length; i++) {
        if (items[i].getAttribute("data-tab") === tab) {
            items[i].classList.add("active");
        } else {
            items[i].classList.remove("active");
        }
    }

    const panels = document.querySelectorAll(".tab-panel");
    for (let i = 0; i < panels.length; i++) {
        if (panels[i].id === "panel-" + tab) {
            panels[i].classList.add("active");
        } else {
            panels[i].classList.remove("active");
        }
    }

    const titles = {
        dashboard: "Academy School Portal",
        streams: "Class Streams Management",
        students: "Student Directory",
        subjects: "Academy Course Catalog",
        scores: "Score Entries & Records",
        results: "Results & Performance Analytics"
    };
    document.getElementById("page-title").innerText = titles[tab] || "Academy School Portal";

    if (tab === "dashboard") renderDashboard();
    if (tab === "streams") renderStreams();
    if (tab === "students") renderStudents();
    if (tab === "subjects") renderSubjects();
    if (tab === "scores") renderScoresView();
    if (tab === "results") renderResults();

    document.getElementById("sidebar").classList.remove("mobile-active");
}

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
}

async function registerStudent(name, streamName) {
    let streamObj = null;
    for (let i = 0; i < state.streams.length; i++) {
        if (state.streams[i].name === streamName) {
            streamObj = state.streams[i];
            break;
        }
    }
    if (!streamObj) {
        alert("Invalid stream");
        return;
    }

    try {
        const res = await fetch(API_BASE_URL + "/students", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                dob: '2010-01-01',
                gender: 'Male',
                stream: streamObj._id
            })
        });

        if (res.ok === false) {
            alert("Could not register student");
            return;
        }

        await loadState();
        updateGlobalStats();
        populateDropdowns();
        renderDashboard();
        renderStudents();
        alert("Student registered!");
    } catch (err) {
        console.log(err);
    }
}

async function deleteStudent(id) {
    if (confirm("Delete this student?") === true) {
        try {
            await fetch(API_BASE_URL + "/students/" + id, { method: 'DELETE' });
            await loadState();
            updateGlobalStats();
            populateDropdowns();
            renderStudents();
            renderDashboard();
        } catch (err) {
            console.log(err);
        }
    }
}

async function deleteStream(id) {
    if (confirm("Delete this stream?") === true) {
        try {
            await fetch(API_BASE_URL + "/streams/" + id, { method: 'DELETE' });
            await loadState();
            updateGlobalStats();
            populateDropdowns();
            renderStreams();
        } catch (err) {
            console.log(err);
        }
    }
}

async function printStudentReport(studentId) {
    try {
        const res = await fetch(API_BASE_URL + "/results/student/" + studentId);
        const data = await res.json();

        let studentObj = null;
        for (let i = 0; i < state.students.length; i++) {
            if (state.students[i]._id === studentId) {
                studentObj = state.students[i];
                break;
            }
        }

        if (!studentObj) {
            alert("Student not found");
            return;
        }

        let studentStreamId = studentObj.streamId;
        if (!studentStreamId && studentObj.stream && studentObj.stream._id) {
            studentStreamId = studentObj.stream._id;
        } else if (!studentStreamId && studentObj.stream) {
            studentStreamId = studentObj.stream;
        }

        let position = "N/A";
        try {
            const classRes = await fetch(API_BASE_URL + "/results/class/" + studentStreamId);
            const classResults = await classRes.json();
            for (let i = 0; i < classResults.length; i++) {
                if (classResults[i].student.id === studentId) {
                    position = classResults[i].position;
                    break;
                }
            }
        } catch (e) {
            console.log(e);
        }

        const printWindow = window.open("", "_blank");

        let tableRowsHtml = "";
        for (let i = 0; i < data.results.length; i++) {
            const r = data.results[i];
            tableRowsHtml = tableRowsHtml +
                "<tr>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd;'>" + r.subject + "</td>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd;'>" + r.code + "</td>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd; text-align:center;'>" + r.examScore + "</td>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd; text-align:center;'>" + r.caScore + "</td>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd; text-align:center;'><strong>" + r.total + "</strong></td>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd; text-align:center;'><strong>" + r.grade + "</strong></td>" +
                "</tr>";
        }

        const reportHtml =
            "<html>" +
            "<head>" +
            "<title>Report Card - " + studentObj.name + "</title>" +
            "<style>" +
            "body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }" +
            ".header { text-align: center; margin-bottom: 40px; }" +
            ".header h1 { margin: 0 0 10px 0; font-size: 28px; color: #2c3e50; text-transform: uppercase; }" +
            ".header p { margin: 0; color: #7f8c8d; font-size: 14px; }" +
            ".info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #eee; }" +
            ".info-item { font-size: 15px; }" +
            "table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }" +
            "th { background: #2c3e50; color: #fff; padding: 12px; text-align: left; text-transform: uppercase; font-size: 12px; }" +
            ".footer { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: center; }" +
            ".sig-line { border-top: 1px solid #999; margin-top: 40px; padding-top: 10px; font-size: 14px; color: #555; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class='header'>" +
            "<h1>Ikonex Academy</h1>" +
            "<p>Official Student Academic Report Card</p>" +
            "</div>" +
            "<div class='info-grid'>" +
            "<div class='info-item'><strong>Student Name:</strong> " + studentObj.name + "</div>" +
            "<div class='info-item'><strong>Student ID:</strong> " + studentObj._id.toUpperCase() + "</div>" +
            "<div class='info-item'><strong>Class Stream:</strong> " + (studentObj.stream && studentObj.stream.name ? studentObj.stream.name : "Unassigned") + "</div>" +
            "<div class='info-item'><strong>Class Position:</strong> Rank " + position + "</div>" +
            "</div>" +
            "<table>" +
            "<thead>" +
            "<tr>" +
            "<th style='text-align:left;'>Subject</th>" +
            "<th style='text-align:left;'>Code</th>" +
            "<th style='text-align:center;'>Exam Score</th>" +
            "<th style='text-align:center;'>CA Score</th>" +
            "<th style='text-align:center;'>Total</th>" +
            "<th style='text-align:center;'>Grade</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            tableRowsHtml +
            "</tbody>" +
            "</table>" +
            "<div style='background: #2c3e50; color: white; padding: 20px; border-radius: 8px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center;'>" +
            "<div><strong>Total Marks:</strong><br>" + data.totalMarks + "</div>" +
            "<div><strong>Average Score:</strong><br>" + data.average + "%</div>" +
            "<div><strong>Overall Grade:</strong><br>" + data.grade + "</div>" +
            "</div>" +
            "<div class='footer'>" +
            "<div><div class='sig-line'>Class Teacher Signature</div></div>" +
            "<div><div class='sig-line'>Principal's Signature & Stamp</div></div>" +
            "</div>" +
            "</body>" +
            "</html>";

        printWindow.document.write(reportHtml);
        printWindow.document.close();

        setTimeout(function () {
            printWindow.print();
        }, 500);

    } catch (err) {
        console.log(err);
        alert("Failed to generate report card!");
    }
}

async function printClassReport(streamId) {
    try {
        const res = await fetch(API_BASE_URL + "/results/class/" + streamId);
        const data = await res.json();

        let streamObj = null;
        for (let i = 0; i < state.streams.length; i++) {
            if (state.streams[i]._id === streamId) {
                streamObj = state.streams[i];
                break;
            }
        }
        if (!streamObj) {
            alert("Stream not found");
            return;
        }

        const printWindow = window.open("", "_blank");

        let tableRowsHtml = "";
        for (let i = 0; i < data.length; i++) {
            const r = data[i];
            tableRowsHtml = tableRowsHtml +
                "<tr>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd;'>" + r.position + "</td>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd;'><strong>" + r.student.name + "</strong></td>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd; text-align:center;'>" + r.totalMarks + "</td>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd; text-align:center;'>" + r.average + "%</td>" +
                "<td style='padding:12px; border-bottom:1px solid #ddd; text-align:center;'><strong>" + r.grade + "</strong></td>" +
                "</tr>";
        }

        const classHtml =
            "<html>" +
            "<head>" +
            "<title>Class Report - " + streamObj.name + "</title>" +
            "<style>" +
            "body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }" +
            ".header { text-align: center; margin-bottom: 40px; }" +
            ".header h1 { margin: 0 0 10px 0; font-size: 28px; color: #2c3e50; text-transform: uppercase; }" +
            ".header p { margin: 0; color: #7f8c8d; font-size: 14px; }" +
            ".meta { margin-bottom: 30px; font-size: 16px; background: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #eee; }" +
            "table { width: 100%; border-collapse: collapse; }" +
            "th { background: #2c3e50; color: #fff; padding: 12px; text-align: left; text-transform: uppercase; font-size: 12px; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class='header'>" +
            "<h1>Ikonex Academy</h1>" +
            "<p>Class Performance Report Sheet</p>" +
            "</div>" +
            "<div class='meta'>" +
            "<strong>Class Stream:</strong> " + streamObj.name + "<br>" +
            "<strong>Total Students Evaluated:</strong> " + data.length +
            "</div>" +
            "<table>" +
            "<thead>" +
            "<tr>" +
            "<th style='text-align:left;'>Position</th>" +
            "<th style='text-align:left;'>Student Name</th>" +
            "<th style='text-align:center;'>Total Marks</th>" +
            "<th style='text-align:center;'>Average Score</th>" +
            "<th style='text-align:center;'>Overall Grade</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            tableRowsHtml +
            "</tbody>" +
            "</table>" +
            "</body>" +
            "</html>";

        printWindow.document.write(classHtml);
        printWindow.document.close();

        setTimeout(function () {
            printWindow.print();
        }, 500);

    } catch (err) {
        console.log(err);
        alert("Failed to generate class report sheet!");
    }
}

function printStudentFromResults() {
    const val = document.getElementById("print-select-student").value;
    if (val === "") {
        alert("Please select a student");
        return;
    }
    printStudentReport(val);
}

function printStreamFromResults() {
    const val = document.getElementById("print-select-stream").value;
    if (val === "") {
        alert("Please select a class stream");
        return;
    }
    printClassReport(val);
}

window.printStudentReport = printStudentReport;
window.printClassReport = printClassReport;
window.printStudentFromResults = printStudentFromResults;
window.printStreamFromResults = printStreamFromResults;

document.addEventListener("DOMContentLoaded", async function () {
    await loadState();
    updateGlobalStats();
    populateDropdowns();
    renderDashboard();

    const links = document.querySelectorAll(".nav-list .nav-item");
    for (let i = 0; i < links.length; i++) {
        const item = links[i];
        item.addEventListener("click", function (e) {
            e.preventDefault();
            switchTab(item.getAttribute("data-tab"));
        });
    }

    const form1 = document.getElementById("quick-register-form");
    if (form1) {
        form1.addEventListener("submit", async function (e) {
            e.preventDefault();
            const n = document.getElementById("reg-name");
            const s = document.getElementById("reg-stream");
            await registerStudent(n.value, s.value);
            n.value = "";
            s.value = "";
        });
    }

    const form2 = document.getElementById("add-student-form");
    if (form2) {
        form2.addEventListener("submit", async function (e) {
            e.preventDefault();
            const n = document.getElementById("student-name");
            const s = document.getElementById("student-stream");
            await registerStudent(n.value, s.value);
            closeModal("modal-add-student");
            n.value = "";
            s.value = "";
        });
    }

    const form3 = document.getElementById("add-stream-form");
    if (form3) {
        form3.addEventListener("submit", async function (e) {
            e.preventDefault();
            const n = document.getElementById("stream-name");
            try {
                const res = await fetch(API_BASE_URL + "/streams", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: n.value })
                });
                if (res.ok === false) {
                    alert("Could not create stream");
                    return;
                }
                await loadState();
                updateGlobalStats();
                populateDropdowns();
                renderStreams();
                closeModal("modal-add-stream");
                n.value = "";
                alert("Stream created!");
            } catch (err) {
                console.log(err);
            }
        });
    }

    const form4 = document.getElementById("add-subject-form");
    if (form4) {
        form4.addEventListener("submit", async function (e) {
            e.preventDefault();
            const n = document.getElementById("subject-name");
            try {
                const ids = [];
                for (let j = 0; j < state.streams.length; j++) {
                    ids.push(state.streams[j]._id);
                }
                const res = await fetch(API_BASE_URL + "/subjects", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: n.value,
                        code: "SUBJ-" + Math.floor(100 + Math.random() * 900),
                        streams: ids
                    })
                });
                if (res.ok === false) {
                    alert("Could not add subject");
                    return;
                }
                await loadState();
                populateDropdowns();
                renderSubjects();
                closeModal("modal-add-subject");
                n.value = "";
                alert("Subject added!");
            } catch (err) {
                console.log(err);
            }
        });
    }

    const form5 = document.getElementById("enter-score-form");
    if (form5) {
        form5.addEventListener("submit", async function (e) {
            e.preventDefault();
            const st = document.getElementById("score-student");
            const sb = document.getElementById("score-subject");
            const sc = document.getElementById("score-value");

            let studentObj = null;
            for (let j = 0; j < state.students.length; j++) {
                if (state.students[j]._id === st.value) {
                    studentObj = state.students[j];
                    break;
                }
            }
            if (!studentObj) {
                alert("Select a valid student");
                return;
            }

            const studentStreamId = studentObj.stream && studentObj.stream._id ? studentObj.stream._id : studentObj.stream;

            try {
                const res = await fetch(API_BASE_URL + "/scores", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        student: st.value,
                        subject: sb.value,
                        stream: studentStreamId,
                        examScore: parseInt(sc.value),
                        caScore: 0
                    })
                });
                if (res.ok === false) {
                    alert("Could not record score");
                    return;
                }
                await loadState();
                updateGlobalStats();
                renderScoresView();
                alert("Score recorded!");
                sc.value = "";
            } catch (err) {
                console.log(err);
            }
        });
    }

    const sInput = document.getElementById("student-search");
    if (sInput) sInput.addEventListener("input", renderStudents);

    const fSelect = document.getElementById("filter-stream");
    if (fSelect) fSelect.addEventListener("change", renderStudents);

    const theme = document.getElementById("theme-toggle");
    if (theme) {
        theme.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            const icon = theme.querySelector("i");
            if (document.body.classList.contains("dark-mode")) {
                icon.innerText = "light_mode";
            } else {
                icon.innerText = "dark_mode";
            }
        });
    }

    const mob = document.getElementById("mobile-menu-toggle");
    if (mob) {
        if (window.innerWidth <= 768) mob.style.display = "flex";
        mob.addEventListener("click", function (e) {
            e.stopPropagation();
            document.getElementById("sidebar").classList.toggle("mobile-active");
        });
    }

    document.addEventListener("click", function (e) {
        const sidebar = document.getElementById("sidebar");
        const mobileBtn = document.getElementById("mobile-menu-toggle");
        if (window.innerWidth <= 768) {
            if (sidebar.classList.contains("mobile-active")) {
                if (sidebar.contains(e.target) === false) {
                    if (mobileBtn.contains(e.target) === false) {
                        sidebar.classList.remove("mobile-active");
                    }
                }
            }
        }
    });

    window.addEventListener("resize", function () {
        const mob = document.getElementById("mobile-menu-toggle");
        if (mob) {
            if (window.innerWidth <= 768) {
                mob.style.display = "flex";
            } else {
                mob.style.display = "none";
                document.getElementById("sidebar").classList.remove("mobile-active");
            }
        }
    });
});
