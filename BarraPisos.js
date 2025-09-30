const sidebar = document.getElementById('sidebar');
const iconeSidebar = document.getElementById('icone-sidebar');

// Alternar sidebar
iconeSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-hidden');
    iconeSidebar.textContent = sidebar.classList.contains('sidebar-hidden') ? '☰' : '×';
});

// Controle de abas
document.querySelectorAll('.aba').forEach(aba => {
    aba.addEventListener('click', () => {
        document.querySelectorAll('.aba, .conteudo-aba').forEach(el => {
            el.classList.remove('ativa');
        });
        aba.classList.add('ativa');
        document.getElementById(`conteudo-${aba.dataset.aba}`).classList.add('ativa');
    });
});