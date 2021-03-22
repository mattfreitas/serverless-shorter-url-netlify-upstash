/**
 * Client-side JavaScript for our Serverless App
 * 
 * @author Matheus Freitas
 * @email msfbr.00@gmail.com
 */
((vanillaJS) => {
    // Please, use your recaptcha site key
    let googleRecaptchaSiteKey = '6Lf5BIoaAAAAAIGANnsvRam_b9dVwki8Sbub_hj6';

    // Selectors
    let buttonShortUrl = document.querySelector('#button-short-url');
    let inputShortUrl = document.querySelector('#input-short-url');
    let modalConfirmationNotARobot = document.querySelectorAll('.modal-confirmation-group');
    let buttonNotARobot = document.querySelector('#button-not-a-robot');
    let pageOverlay = document.querySelector('#overlay');
    let confirmationStatus = {
        success: document.querySelector('#confirm-status-success'),
        error: document.querySelector('#confirm-status-error')
    }

    /**
     * Open the confirmation modal before short an URL so
     * we avoid bots and flood.
     */
     function openConfirmationModal() {
        modalConfirmationNotARobot.forEach((item) => {
            item.classList.remove("hidden");
            item.classList.add("opacity-100");
        });
    }

    /**
     * Closes the confirmation modal.
     */
     function closeConfirmationModal() {
        modalConfirmationNotARobot.forEach((item) => {
            item.classList.add("hidden");
            item.classList.remove("opacity-100");
        });
    }

    /**
     * Confirms that the user isn't a bot using Google reCaptcha Api.
     */
    function confirmImNotARobot() {
        grecaptcha.ready(function() {
            grecaptcha.execute('6Lf5BIoaAAAAAIGANnsvRam_b9dVwki8Sbub_hj6', { action: 'submit' }).then(function(token) {
                fetch('/app/short-url', { 
                    method: 'POST', 
                    body: JSON.stringify({
                        url: inputShortUrl.value,
                        token: token
                    }) 
                });
            });
        });
    }


    /**
     * Event triggers
     */
     buttonShortUrl.addEventListener('click', openConfirmationModal);
     buttonNotARobot.addEventListener('click', confirmImNotARobot);
     pageOverlay.addEventListener('click', closeConfirmationModal);

    console.log('hey there')
})('Vanilla.js Rocks!');