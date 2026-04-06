<template>
    <div class="footer-content">
        <div class="footer-left">
            © 2026 OneStep. A simple tool designed for focus, for a calmer, more organised day. |
            <a target="_blank" href="https://icons8.com/icon/ulGWjC9dcyIM/tea">Tea</a> icon by <a target="_blank"
                href="https://icons8.com">Icons8</a>
        </div>

        <div class="footer-right">
            <RouterLink to="/privacy">Privacy</RouterLink>
            <RouterLink to="/terms">Terms</RouterLink>
            <RouterLink to="/support">Support</RouterLink>
        </div>
    </div>
</template>

<style>
.footer-content {
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    font-size: 14.6px;
    background-color: #c2c2c291;
    position: relative;
    bottom: 0;
    padding: 20px;
    min-height: 80px;
    /* border: 2px black solid; */
}

.footer-left {
    max-width: 420px;
    line-height: 1.5;
}

.footer-right {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
}

 a {
    color: #000000;
    /* text-decoration: none; */
    transition: all .4s;
}

.footer-right a:hover {
    opacity: 0.7;
}
</style>