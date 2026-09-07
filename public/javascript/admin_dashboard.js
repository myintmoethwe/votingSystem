

// model js// Open Modal
function openAddCandidateModal() {
    const modal = document.getElementById("candidateModal");
    if (modal) modal.style.display = "flex";
}

// Close Modal
function closeCandidateModal() {
    const modal = document.getElementById("candidateModal");
    if (modal) modal.style.display = "none";
    document.getElementById("candidateForm").reset();
}

// --- FETCH & LOAD CANDIDATES FROM DATABASE ---
async function loadCandidates() {
    const tableBody = document.getElementById("candidateTable");
    if (!tableBody) return;

    try {
        const response = await fetch('/api/admin/candidates');
        if (!response.ok) throw new Error('Failed to fetch candidates');

        const candidates = await response.json();
        tableBody.innerHTML = ""; // Clear table before rendering

        if (candidates.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No candidates found.</td></tr>`;
            return;
        }

        candidates.forEach(c => {
            const categoryIcon = c.category === "King" ? "👑 King" : c.category === "Queen" ? "👸 Queen" : c.category;
            const categoryClass = c.category.toLowerCase();
            const statusClass = c.status ? c.status.toLowerCase() : 'active';
            const imgSrc = c.image || 'voteimg/default.jpg';

            const newRow = document.createElement("tr");
            newRow.setAttribute("data-category", c.category);
            newRow.setAttribute("data-status", c.status);

            newRow.innerHTML = `
                <td>#${c.id}</td>
                <td>
                    <div class="candidate-info">
                        <img src="/${imgSrc}" alt="${c.name}" onerror="this.src='voteimg/default.jpg'">
                        <div>
                            <strong>${c.name}</strong>
                            <small>Major: ${c.major || '-'} | Age ${c.age}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="category ${categoryClass}">${categoryIcon}</span>
                </td>
                <td><strong>${c.votes || 0}</strong></td>
                <td>
                    <span class="status ${statusClass}">${c.status}</span>
                </td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn" onclick="deleteCandidate(${c.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });
    } catch (err) {
        console.error('Error loading candidates:', err);
    }
}

// --- HANDLE FORM SUBMISSION TO DATABASE ---
async function handleCandidateSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('candidateForm');
    const formData = new FormData(form); // Automatically packs all text inputs and the device image file

    try {
        const response = await fetch('/api/admin/candidates', {
            method: 'POST',
            body: formData // Do NOT manually set 'Content-Type' header; fetch handles multipart boundaries automatically
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message || 'Candidate added successfully!');
            form.reset();
            // closeCandidateModal(); // Uncomment if you have this function
            location.reload(); // Refreshes page to load the new candidate card/row and image
        } else {
            alert(result.message || 'Failed to add candidate.');
        }
    } catch (err) {
        console.error('Error submitting form:', err);
        alert('An error occurred while saving the candidate.');
    }
}
// --- DELETE CANDIDATE FROM DATABASE ---
async function deleteCandidate(id) {
    if (!confirm("Are you sure you want to delete this candidate?")) return;

    try {
        const response = await fetch(`/api/admin/candidates/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadCandidates(); // Refresh table after deletion
        } else {
            alert('Failed to delete candidate.');
        }
    } catch (err) {
        console.error('Delete Error:', err);
        alert('Server connection error.');
    }
}

// Attach listeners on page load
document.addEventListener("DOMContentLoaded", () => {
    const headerAddBtn = document.querySelector(".page-header .add-btn");
    if (headerAddBtn) {
        headerAddBtn.addEventListener("click", openAddCandidateModal);
    }

    // Load candidates from database when page initializes
    loadCandidates();
});