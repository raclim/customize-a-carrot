const supabaseClient = supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_PUBLISHABLE_KEY
);

const galleryGrid = document.getElementById("galleryGrid");
const galleryStatus = document.getElementById("galleryStatus");
const gallerySearch = document.getElementById("gallerySearch");
const galleryCount = document.getElementById("galleryCount");
const uploadModal = document.getElementById("uploadModal");
const openUploadButton = document.getElementById("openUploadButton");
const galleryAddCard = document.getElementById("galleryAddCard");
const closeUploadButton = document.getElementById("closeUploadButton");
const uploadForm = document.getElementById("uploadForm");
const imageUpload = document.getElementById("imageUpload");
const uploadPreview = document.getElementById("uploadPreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const uploadStatus = document.getElementById("uploadStatus");
const submitUploadButton = document.getElementById("submitUploadButton");
const postTitle = document.getElementById("postTitle");
const postAuthor = document.getElementById("postAuthor");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp"
];

let galleryPosts = [];

async function loadGallery() {
    galleryStatus.textContent = "Loading carrots...";

    const { data, error } =
        await supabaseClient
            .from("gallery_posts")
            .select(
                `
                id,
                title,
                author,
                image_path,
                created_at
                `
            )
            .eq(
                "status",
                "approved"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {
        console.error( "Could not load gallery:", error);
        galleryStatus.textContent = "Could not load the gallery.";
        return;
    }

    galleryPosts = data || [];
    galleryStatus.textContent ="";

    renderGallery();
}

function renderGallery() {
    // Remove existing generated posts.
    document.querySelectorAll(".gallery-post")
        .forEach(post => post.remove());

    const search = gallerySearch.value.trim().toLowerCase();

    const filteredPosts = galleryPosts.filter(post => {
                const searchableText = `${post.title} ${post.author}`.toLowerCase();
                return searchableText.includes(search);
            }
        );

    filteredPosts.forEach(createGalleryCard);

    const count =galleryPosts.length;

    galleryCount.textContent = count === 1
            ? "1 carrot"
            : `${count} carrots`;

    if ( galleryPosts.length > 0 && filteredPosts.length === 0) {
        galleryStatus.textContent = "No carrots found.";
    } else if (galleryPosts.length === 0) {
        galleryStatus.textContent = "No carrots yet. Be the first!";
    } else {
        galleryStatus.textContent = "";
    }
}

function createGalleryCard(post) {
    const article = document.createElement("article");
    article.className = "gallery-card gallery-post";

    const { data } = supabaseClient.storage.from("gallery-images").getPublicUrl(post.image_path);
    const imageURL = data.publicUrl;

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "gallery-image";
    const image = document.createElement("img");
    image.src = imageURL;
    image.alt = post.title;
    image.loading = "lazy";
    imageWrapper.appendChild(image);

    const info = document.createElement("div");
    info.className = "gallery-info";
    const title = document.createElement("span");
    title.className = "gallery-title";

    // Use textContent because title is user-submitted.
    title.textContent = post.title;
    const author = document.createElement("span");

    author.className = "gallery-author";
    author.textContent = `by ${post.author}`;

    info.appendChild(title);
    info.appendChild(author);
    article.appendChild(imageWrapper);
    article.appendChild(info);
    galleryGrid.appendChild( article);
}

gallerySearch.addEventListener("input", renderGallery);

function openUploadModal() {
    uploadModal.classList.add("open");
    uploadModal.setAttribute("aria-hidden","false");
    uploadStatus.textContent = "";
}

function closeUploadModal() {
    uploadModal.classList.remove("open");
    uploadModal.setAttribute("aria-hidden", "true");
}

openUploadButton.addEventListener("click",openUploadModal);
galleryAddCard.addEventListener("click", openUploadModal);
closeUploadButton.addEventListener("click", closeUploadModal);

// Clicking the dark area closes modal.
uploadModal.addEventListener( "click",
    function (event) {
        if (event.target === uploadModal) {
            closeUploadModal();
        }
    }
);

// Escape closes modal
document.addEventListener("keydown",
    function (event) {
        if ( event.key === "Escape") {
            closeUploadModal();
        }
    }
);

function validateImage(file) {
    if (!file) {
        return {
            valid: false, 
            message: "Choose an image first."
        };
    }


    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return {
            valid: false,
            message:"Please choose a PNG, JPG, or WEBP."
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            message: "Your image must be smaller than 5 MB."
        };
    }

    return { valid: true };
}

let previewURL = null;

imageUpload.addEventListener( "change",
    function () {
        const file = imageUpload.files[0];
        const validation = validateImage(file);

        if (!validation.valid) {
            uploadStatus.textContent = validation.message;
            imageUpload.value = "";

            return;
        }

        uploadStatus.textContent ="";

        // Remove previous preview URL.
        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }

        previewURL = URL.createObjectURL(file);

        uploadPreview.src = previewURL;
        uploadPreview.style.display = "block";
        uploadPlaceholder.style.display = "none";
    }
);

function createFileName(file) {
    let extension =file.name.split(".").pop().toLowerCase();

    // Don't trust arbitrary extensions.
    if (
        ![
            "png",
            "jpg",
            "jpeg",
            "webp"
        ].includes(extension)
    ) {
        extension = "png";
    }


    return `${crypto.randomUUID()}.${extension}`;
}

uploadForm.addEventListener("submit",
    async function (event) {
        event.preventDefault();
        const file = imageUpload.files[0];
        const validation = validateImage(file);

        if (!validation.valid) {
            uploadStatus.textContent = validation.message;
            return;
        }

        const title = postTitle.value.trim();
        const author = postAuthor.value.trim();

        if (!title) {
            uploadStatus.textContent = "Give your carrot a title.";
            return;
        }

        if (!author) {
            uploadStatus.textContent = "Enter your name.";
            return;
        }

        if (title.length > 50) {
            uploadStatus.textContent = "Title must be 50 characters or less.";
            return;
        }

        if (author.length > 30) {
            uploadStatus.textContent = "Name must be 30 characters or less.";
            return;
        }

        submitUploadButton.disabled =true;
        submitUploadButton.textContent = "Uploading...";
        uploadStatus.textContent = "Uploading your carrot...";

        const fileName =createFileName(file);
        const filePath =`uploads/${fileName}`;
        let imageWasUploaded =false;

        try {
            const { 
                error: uploadError
            } =
                await supabaseClient
                    .storage
                    .from("gallery-images")
                    .upload(
                        filePath,
                        file,
                        {
                            cacheControl:"3600",
                            upsert: false,
                            contentType:file.type
                        }
                    );


            if (uploadError) {
                throw uploadError;
            }
            imageWasUploaded = true;

            const {
                error: databaseError
            } =
                await supabaseClient
                    .from("gallery_posts")
                    .insert({
                        title: title,
                        author: author,
                        image_path: filePath,
                        status:"pending"
                    });

            if (databaseError) {
                throw databaseError;
            }

            resetUploadForm();
            closeUploadModal();
            alert("Submitted! Your carrot will appear after it is approved.");
        } catch (error) {
            console.error( "Upload failed:", error);
            uploadStatus.textContent = "Something went wrong. Check the console for details.";
            // If the image uploaded successfully but the database insert failed, 
            // there will currently be an orphaned file in supabase storage.
        } finally {
            submitUploadButton.disabled =false;
            submitUploadButton.textContent = "Submit to Gallery";
        }
    }
);

function resetUploadForm() {
    uploadForm.reset();

    if (previewURL) {
        URL.revokeObjectURL(previewURL);
        previewURL = null;
    }

    uploadPreview.removeAttribute("src");
    uploadPreview.style.display ="none";
    uploadPlaceholder.style.display ="flex";
    uploadStatus.textContent = "";
}

loadGallery();
