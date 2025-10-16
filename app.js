// Contador de patinhas
const botaoPatinha = document.getElementById('botao-patinha');
const contador = document.getElementById('contador');
const miauAudio = document.getElementById('miauAudio');
const gatoBravoAudio = document.getElementById('gatoBravoAudio');
const gatosAnimacao = document.getElementById('gatos-animacao');
let contagem = 0;

botaoPatinha.addEventListener('click', () => {
    contagem++;
    contador.textContent = contagem;
    botaoPatinha.classList.add('shake');

    // Tocar o som de miau
    if (miauAudio) {
        miauAudio.pause();
        miauAudio.currentTime = 0;
        miauAudio.play();
    }

    // Verificar se passou de 10 cliques
    if (contagem === 10) {
        mostrarGatosAnimacao();
    }

    setTimeout(() => {
        botaoPatinha.classList.remove('shake');
    }, 500);
});

function mostrarGatosAnimacao() {
    if (gatosAnimacao) {
        gatosAnimacao.classList.remove('hidden');
        gatosAnimacao.innerHTML = '';
        // Emoji de gato bravo imediatamente
        const emojiBravo = document.createElement('span');
        emojiBravo.className = 'gato-emoji';
        emojiBravo.textContent = '😾';
        emojiBravo.style.top = '50vh';
        emojiBravo.style.left = '45vw';
        emojiBravo.style.fontSize = '5rem';
        emojiBravo.style.zIndex = '3000';
        emojiBravo.style.animation = 'none';
        gatosAnimacao.appendChild(emojiBravo);

        // Reproduzir som de gato bravo
        if (gatoBravoAudio) {
            gatoBravoAudio.pause();
            gatoBravoAudio.currentTime = 0;
            gatoBravoAudio.play();
        }
        // Criar 100 emojis de gato em posições aleatórias por toda a tela
        const emojis = ['🐱','😺','😸','😹','😻','😼','🙀','😽','😾','😿','😺','😸','😹','😻','😼','🙀','😽','😾','😿'];
        const quantidade = 100;
        for (let i = 0; i < quantidade; i++) {
            const emoji = document.createElement('span');
            emoji.className = 'gato-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.top = `${Math.random() * 95}vh`;
            emoji.style.left = `-10vw`;
            emoji.style.animationDelay = `${Math.random() * 1.5}s`;
            emoji.style.fontSize = `${Math.random() * 2 + 2}rem`;
            emoji.style.animationDuration = '1.2s';
            gatosAnimacao.appendChild(emoji);
        }
        setTimeout(() => {
            gatosAnimacao.classList.add('hidden');
            gatosAnimacao.innerHTML = '';
            contagem = 0;
            contador.textContent = contagem;
        }, 3000);
    }
}

// Som do gatinho
const gatoContainer = document.getElementById('gato-container');
const sons = ['Miau!', 'Meow!', 'Mrrrow!', 'Prrrup!'];

gatoContainer.addEventListener('click', () => {
    // Criar elemento de texto temporário
    const som = document.createElement('span');
    som.textContent = sons[Math.floor(Math.random() * sons.length)];
    som.style.position = 'absolute';
    som.style.left = `${Math.random() * 80 + 10}%`;
    som.style.color = '#ff6b6b';
    som.style.fontSize = '1.5rem';
    som.style.pointerEvents = 'none';
    
    gatoContainer.appendChild(som);
    
    // Animação do texto subindo
    let posY = 0;
    const animar = () => {
        posY -= 2;
        som.style.transform = `translateY(${posY}px)`;
        som.style.opacity = 1 + posY/100;
        
        if (posY > -100) {
            requestAnimationFrame(animar);
        } else {
            som.remove();
        }
    };
    
    animar();
});

// Adicionar efeitos de hover nas seções
document.querySelectorAll('section').forEach(section => {
    section.addEventListener('mouseenter', () => {
        section.style.transform = 'scale(1.01)';
        section.style.transition = 'transform 0.3s';
    });
    
    section.addEventListener('mouseleave', () => {
        section.style.transform = 'scale(1)';
    });
});
