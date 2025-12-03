let total = 0;
        let cartItems = [];
        let currentModalCategory = '';
        let currentModalBasePrice = 0;
        let currentHighlight = null;
        let activePromo = null;
        let currentPromoType = '';
        let maisPedidosFreeCounts = { frutas: 0, complementos: 0, coberturas: 0 };

        // Promo system
        const promoData = {
            'segunda': {
                name: 'Dobradinha do Açaí',
                day: 1, // Monday
                emoji: '🔥',
                description: 'Compre 1 opção pronta (500ml) e leve a segunda com 50% OFF!',
                instructions: [
                    '1. Adicione 2 opções prontas de 500ml ao carrinho',
                    '2. O desconto de 50% será aplicado na opção mais barata',
                    '3. Válido apenas às segundas-feiras',
                    '4. Não acumula com outras promoções'
                ],
                color: 'from-primary to-purple-700'
            },
            'terca': {
                name: 'Terça da Família',
                day: 2, // Tuesday
                emoji: '👨‍👩‍👧‍👦',
                description: 'A cada 3 opções prontas 500ml, leve +1 Tradicional GRÁTIS!',
                instructions: [
                    '1. Adicione 3 opções prontas de 500ml ao carrinho',
                    '2. Ganhe 1 Tradicional 500ml GRÁTIS automaticamente',
                    '3. Válido apenas às terças-feiras',
                    '4. Pode repetir: 6 opções = 2 grátis, 9 opções = 3 grátis...'
                ],
                color: 'from-primary to-purple-700'
            },
            'domingo': {
                name: 'Domingo do Batido',
                day: 0, // Sunday
                emoji: '🥤',
                description: '2 Batidos por R$ 25,00 (em vez de R$ 30,00)',
                instructions: [
                    '1. Adicione 2 Batidos 500ml ao carrinho',
                    '2. Preço especial de R$ 25,00 será aplicado',
                    '3. Válido apenas aos domingos',
                    '4. Economia de R$ 5,00 por dupla'
                ],
                color: 'from-primary to-purple-700'
            }
        };

        function openPromoModal(promoType) {
            currentPromoType = promoType;
            const promo = promoData[promoType];
            const today = new Date().getDay();
            const isValidDay = today === promo.day;
            
            // Update modal content
            document.getElementById('promo-modal-title').textContent = promo.name;
            document.getElementById('promo-modal-subtitle').textContent = promo.description;
            
            // Update header color
            const header = document.getElementById('promo-modal-header');
            header.className = `text-white p-6 rounded-t-3xl bg-gradient-to-r ${promo.color}`;
            
            // Populate modal body
            const modalBody = document.getElementById('promo-modal-body');
            modalBody.innerHTML = `
                <!-- Day Validation -->
                <div class="text-center mb-6">
                    ${isValidDay ? `
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div class="flex items-center justify-center text-green-700">
                                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="font-bold">Promoção Disponível Hoje!</span>
                            </div>
                            <p class="text-sm text-green-600 mt-2">Você pode ativar esta promoção agora.</p>
                        </div>
                    ` : `
                        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div class="flex items-center justify-center text-red-700">
                                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="font-bold">Promoção Indisponível</span>
                            </div>
                            <p class="text-sm text-red-600 mt-2">Esta promoção só funciona ${getDayName(promo.day)}.</p>
                        </div>
                    `}
                </div>

                <!-- Instructions -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-primary mb-4">${promo.emoji} Como Funciona:</h3>
                    <div class="space-y-3">
                        ${promo.instructions.map(instruction => `
                            <div class="flex items-start">
                                <div class="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                                    ${instruction.charAt(0)}
                                </div>
                                <p class="text-gray-700 text-sm">${instruction.substring(3)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Current Status -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-primary mb-2">📊 Status Atual:</h4>
                    <div class="text-sm text-gray-600">
                        <p><strong>Dia da Semana:</strong> ${getCurrentDayName()}</p>
                        <p><strong>Promoção Ativa:</strong> ${activePromo ? activePromo.name : 'Nenhuma'}</p>
                        <p><strong>Itens no Carrinho:</strong> ${cartItems.length}</p>
                    </div>
                </div>
            `;
            
            // Update activate button
            const activateButton = document.getElementById('promo-activate-button');
            const activateText = document.getElementById('promo-activate-text');
            
            if (!isValidDay) {
                activateButton.classList.add('bg-gray-400', 'cursor-not-allowed');
                activateButton.classList.remove('bg-secondary', 'hover:bg-yellow-500');
                activateText.textContent = `Disponível ${getDayName(promo.day)}`;
                activateButton.disabled = true;
            } else {
                activateButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
                activateButton.classList.add('bg-secondary', 'hover:bg-yellow-500');
                
                // Different button text based on promo type
                if (currentPromoType === 'terca') {
                    activateText.textContent = 'Ativar Promoção';
                } else if (currentPromoType === 'segunda' || currentPromoType === 'domingo') {
                    activateText.textContent = 'Ativar Promoção';
                } else {
                    activateText.textContent = 'Adicionar ao Carrinho';
                }
                activateButton.disabled = false;
            }
            
            // Show modal with animation
            const modal = document.getElementById('promo-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('promo-modal-content').classList.remove('translate-y-full');
            }, 10);
        }

        function closePromoModal() {
            const modal = document.getElementById('promo-modal');
            const modalContent = document.getElementById('promo-modal-content');
            
            modalContent.classList.add('translate-y-full');
            setTimeout(() => {
                modal.classList.add('hidden');
                currentPromoType = '';
            }, 300);
        }

        function addPromoToCart() {
            if (!currentPromoType) return;
            
            const promo = promoData[currentPromoType];
            const today = new Date().getDay();
            
            // Check if it's the right day
            if (today !== promo.day) {
                showMessage(`Esta promoção só funciona ${getDayName(promo.day)}!`);
                return;
            }
            
            // Just activate the promo for all types - don't add items automatically
            activePromo = {
                type: currentPromoType,
                name: promo.name,
                emoji: promo.emoji,
                description: promo.description
            };
            
            // Show appropriate message based on promo type
            if (currentPromoType === 'segunda') {
                showMessage('🎉 Dobradinha do Açaí ativada! Adicione 2 opções prontas de 500ml e ganhe 50% OFF na segunda!');
            } else if (currentPromoType === 'terca') {
                showMessage('🎉 Terça da Família ativada! Adicione opções prontas de 500ml e ganhe Tradicionais grátis!');
            } else if (currentPromoType === 'domingo') {
                showMessage('🎉 Domingo do Batido ativado! Adicione 2 Batidos de 500ml e pague apenas R$ 25,00!');
            }
            
            // Update UI
            updatePromoIndicators();
            updateCartDisplay();
            
            closePromoModal();
        }
        
        function addPromoItemToCart(itemName, price) {
            const cartItem = {
                category: `${itemName} - 500ml (Promoção)`,
                selections: [],
                total: price
            };
            
            // Add base item
            cartItem.selections.push({
                type: 'promo-base',
                text: '500ml',
                price: price
            });
            
            // Add ingredients based on item type
            const ingredients = {
                'Tradicional': ['Açaí', 'Banana', 'Leite em Pó', 'Leite Condensado', 'Granola'],
                'Batido': ['Açaí', 'Leite', 'Banana', 'Leite Condensado']
            };
            
            if (ingredients[itemName]) {
                ingredients[itemName].forEach(ingredient => {
                    cartItem.selections.push({
                        type: 'ingredientes-inclusos',
                        text: ingredient,
                        price: 0
                    });
                });
            }
            
            cartItems.push(cartItem);
        }

        function deactivatePromo() {
            if (!activePromo) return;
            
            const promoName = activePromo.name;
            activePromo = null;
            
            // Update UI
            updatePromoIndicators();
            updateCartDisplay();
            
            showMessage(`${promoName} desativada.`);
        }

        function updatePromoIndicators() {
            const indicator = document.getElementById('active-promo-indicator');
            const promoName = document.getElementById('active-promo-name');
            const promoDescription = document.getElementById('active-promo-description');
            
            if (activePromo) {
                indicator.classList.remove('hidden');
                promoName.textContent = `${activePromo.emoji} ${activePromo.name}`;
                promoDescription.textContent = 'Desconto aplicado automaticamente';
            } else {
                indicator.classList.add('hidden');
            }
            
            // Update promo status in cards
            Object.keys(promoData).forEach(promoType => {
                const statusElement = document.getElementById(`${promoType}-status`);
                if (statusElement) {
                    if (activePromo && activePromo.type === promoType) {
                        statusElement.textContent = 'ATIVA';
                        statusElement.classList.add('text-green-300', 'font-bold');
                    } else {
                        const dayName = promoType === 'segunda' ? 'TODA' : promoType === 'terca' ? 'TODA' : 'TODO';
                        statusElement.textContent = dayName;
                        statusElement.classList.remove('text-green-300', 'font-bold');
                    }
                }
            });
        }

        function getDayName(dayNumber) {
            const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
            return days[dayNumber];
        }

        function getCurrentDayName() {
            return getDayName(new Date().getDay());
        }

        function calculatePromoDiscount() {
            if (!activePromo) return 0;
            
            let discount = 0;
            
            if (activePromo.type === 'segunda') {
                // Dobradinha do Açaí: 50% off on second opção pronta de 500ml
                const promoItems = cartItems.filter(item => 
                    item.category.includes('500ml') && 
                    (item.category.includes('Tradicional') || 
                     item.category.includes('Especial') || 
                     item.category.includes('Kids') || 
                     item.category.includes('Premium') || 
                     item.category.includes('Tropical') || 
                     item.category.includes('Batido'))
                );
                
                if (promoItems.length >= 2) {
                    // Sort items by price to apply discount to cheaper ones
                    const sortedItems = [...promoItems].sort((a, b) => a.total - b.total);
                    
                    // Apply 50% discount to every second item (the cheaper one in each pair)
                    const pairs = Math.floor(sortedItems.length / 2);
                    for (let i = 0; i < pairs; i++) {
                        discount += sortedItems[i * 2].total * 0.5; // 50% off on cheaper item
                    }
                }
            } else if (activePromo.type === 'terca') {
                // Terça da Família: Free Tradicional for every 3 opções prontas de 500ml
                const combo500mlItems = cartItems.filter(item => 
                    item.category.includes('500ml') && 
                    (item.category.includes('Tradicional') || 
                     item.category.includes('Especial') || 
                     item.category.includes('Kids') || 
                     item.category.includes('Premium') || 
                     item.category.includes('Tropical') || 
                     item.category.includes('Batido') ||
                     item.category.includes('Combo'))
                );
                
                console.log('Terça da Família - Opções prontas 500ml encontradas:', combo500mlItems.length); // Debug
                
                // For every 3 opções prontas de 500ml, add 1 free Tradicional
                const freeTradicionalCount = Math.floor(combo500mlItems.length / 3);
                
                if (freeTradicionalCount > 0) {
                    // Add free Tradicional items to cart if not already added
                    const currentFreeItems = cartItems.filter(item => 
                        item.category.includes('Tradicional GRÁTIS')
                    );
                    
                    const itemsToAdd = freeTradicionalCount - currentFreeItems.length;
                    
                    for (let i = 0; i < itemsToAdd; i++) {
                        const freeItem = {
                            category: 'Tradicional GRÁTIS - 500ml (Terça da Família)',
                            selections: [
                                {
                                    type: 'promo-free',
                                    text: '500ml - GRÁTIS',
                                    price: 0
                                },
                                {
                                    type: 'ingredientes-inclusos',
                                    text: 'Açaí',
                                    price: 0
                                },
                                {
                                    type: 'ingredientes-inclusos',
                                    text: 'Banana',
                                    price: 0
                                },
                                {
                                    type: 'ingredientes-inclusos',
                                    text: 'Leite em Pó',
                                    price: 0
                                },
                                {
                                    type: 'ingredientes-inclusos',
                                    text: 'Leite Condensado',
                                    price: 0
                                },
                                {
                                    type: 'ingredientes-inclusos',
                                    text: 'Granola',
                                    price: 0
                                }
                            ],
                            total: 0
                        };
                        
                        cartItems.push(freeItem);
                    }
                    
                    // Remove excess free items if user removed combos
                    if (itemsToAdd < 0) {
                        const itemsToRemove = Math.abs(itemsToAdd);
                        for (let i = 0; i < itemsToRemove; i++) {
                            const freeItemIndex = cartItems.findIndex(item => 
                                item.category.includes('Tradicional GRÁTIS')
                            );
                            if (freeItemIndex >= 0) {
                                cartItems.splice(freeItemIndex, 1);
                            }
                        }
                    }
                }
                
            } else if (activePromo.type === 'domingo') {
                // Domingo do Batido: 2 batidos for R$ 25,00
                const promoItems = cartItems.filter(item => 
                    item.category.includes('Promoção') && 
                    item.category.includes('Batido')
                );
                
                const pairs = Math.floor(promoItems.length / 2);
                const normalPrice = pairs * 30.00; // 2 batidos at R$ 15,00 each
                const promoPrice = pairs * 25.00;
                discount += normalPrice - promoPrice;
            }
            
            return discount;
        }

        // Initialize promo system
        function initPromoSystem() {
            updatePromoIndicators();
            updatePromoVisibility();
        }

        function updatePromoVisibility() {
            const today = new Date().getDay();
            
            Object.keys(promoData).forEach(promoType => {
                const promo = promoData[promoType];
                const promoCard = document.querySelector(`[onclick="openPromoModal('${promoType}')"]`);
                
                if (promoCard) {
                    if (today === promo.day) {
                        // Show promo card - it's the right day
                        promoCard.style.display = 'block';
                        promoCard.classList.add('pulse-animation');
                    } else {
                        // Hide promo card - wrong day
                        promoCard.style.display = 'none';
                        promoCard.classList.remove('pulse-animation');
                    }
                }
            });
            
            // Check if any promos are visible
            const visiblePromos = document.querySelectorAll('[onclick*="openPromoModal"]:not([style*="display: none"])');
            const promosSection = document.querySelector('.mb-8'); // First mb-8 div is the promos section
            
            if (visiblePromos.length === 0) {
                // Hide entire promos section if no promos are active today
                if (promosSection) {
                    promosSection.style.display = 'none';
                }
            } else {
                // Show promos section if at least one promo is active
                if (promosSection) {
                    promosSection.style.display = 'block';
                }
            }
        }



        // Ready options modal functions
        function openReadyOptionModal(readyType) {
            const readyOptions = {
                'batido-ready': {
                    title: 'Batido',
                    description: 'Açaí cremoso batido com leite, banana e leite condensado — refrescante e delicioso.',
                    image: '🥤',
                    ingredients: ['Açaí', 'Leite', 'Banana', 'Leite Condensado'],
                    basePrice: 15.00
                },
                'tradicional-ready': {
                    title: 'Tradicional',
                    description: 'Sabor clássico e equilibrado, o favorito de quem gosta do açaí raiz.',
                    image: '🍓',
                    ingredients: ['Açaí', 'Banana', 'Leite em Pó', 'Leite Condensado', 'Granola'],
                    basePrice: 25.00
                },
                'especial-ready': {
                    title: 'Especial',
                    description: 'Mistura tropical e cremosa com o toque irresistível da Nutella.',
                    image: '🥜',
                    ingredients: ['Açaí', 'Morango', 'Kiwi', 'Manga', 'Amendoim', 'Nutella', 'Calda de Chocolate'],
                    basePrice: 30.00
                },
                'kids-ready': {
                    title: 'Kids',
                    description: 'Colorido, divertido e doce na medida certa — sucesso com a criançada.',
                    image: '🍭',
                    ingredients: ['Açaí', 'Banana', 'Morango', 'Confete', 'Jujuba', 'Sucrilhos', 'Fini Beijos'],
                    basePrice: 29.00
                },
                'premium-ready': {
                    title: 'Premium',
                    description: 'Camadas ricas e crocantes, um açaí digno de foto — o mais completo da casa.',
                    image: '👑',
                    ingredients: ['Açaí', 'Uva', 'Abacaxi', 'Kiwi', 'Sucrilhos', 'Paçoca', 'Leite em Pó', 'Nutella', 'Fini Banana'],
                    basePrice: 40.00
                },
                'tropical-ready': {
                    title: 'Tropical',
                    description: 'Refrescante e equilibrado — combina o sabor das frutas com doçura cremosa.',
                    image: '🥥',
                    ingredients: ['Açaí', 'Uva', 'Abacaxi', 'Kiwi', 'Amendoim', 'Paçoca', 'Leite em Pó', 'Leite Condensado'],
                    basePrice: 32.00
                }
            };
            
            currentHighlight = readyOptions[readyType];
            
            // Update modal content
            document.getElementById('highlight-modal-title').textContent = currentHighlight.title;
            document.getElementById('highlight-modal-subtitle').textContent = 'Escolha o recipiente e tamanho';
            
            // Populate modal body
            const modalBody = document.getElementById('highlight-modal-body');
            modalBody.innerHTML = `
                <!-- Description -->
                <div class="text-center">
                    <p class="text-gray-700 leading-relaxed mb-4">${currentHighlight.description}</p>
                </div>
                
                <!-- Ingredients -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-primary mb-3">🥄 O QUE VEM NESTE AÇAÍ:</h3>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="flex flex-wrap gap-2">
                            ${currentHighlight.ingredients.map(ingredient => `
                                <span class="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">${ingredient}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>

                ${currentHighlight.title === 'Batido' ? `
                    <!-- Size Selection for Batido (only 500ml) -->
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-primary mb-3">📏 TAMANHO <span class="text-red-500">*</span></h3>
                        <select name="ready-size" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="updateReadyOptionPrice()">
                            <option value="">Escolha o tamanho...</option>
                            <option value="500ml">500ml - R$ ${currentHighlight.basePrice.toFixed(2).replace('.', ',')}</option>
                        </select>
                    </div>
                ` : `
                    <!-- Container Selection -->
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-primary mb-3">🥄 RECIPIENTE <span class="text-red-500">*</span></h3>
                        <select name="ready-container" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="toggleReadyMontagem(); updateReadyOptionPrice()">
                            <option value="">Escolha o recipiente...</option>
                            <option value="tigela">🥄 Tigela</option>
                            <option value="copo">🥤 Copo</option>
                        </select>
                    </div>

                    <!-- Montagem (only for tigela) -->
                    <div id="ready-montagem" class="mb-6 hidden">
                        <h3 class="text-lg font-bold text-primary mb-3">🥄 COMO VOCÊ QUER SEU AÇAÍ? <span class="text-red-500">*</span></h3>
                        <select name="ready-montagem-select" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="updateReadyOptionPrice()">
                            <option value="">Selecione como quer seu açaí...</option>
                            <option value="montado">Montado - Açaí já misturado com os complementos</option>
                            <option value="separado">Separado - Açaí e complementos em recipientes separados</option>
                        </select>
                    </div>

                    <!-- Size Selection (fixed 500ml for ready options) -->
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-primary mb-3">📏 TAMANHO</h3>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="flex justify-between items-center">
                                <span class="font-medium">500ml</span>
                                <span class="text-primary font-bold">R$ ${currentHighlight.basePrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>
                `}
            `;
            
            // Reset add button
            document.getElementById('highlight-add-text').textContent = 'Selecione as opções';
            
            // Show modal with animation
            const modal = document.getElementById('highlight-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('highlight-modal-content').classList.remove('translate-y-full');
                // Reset scroll position to top after modal is visible
                const modalBody = document.getElementById('highlight-modal-body');
                modalBody.scrollTop = 0;
            }, 10);
        }

        function toggleReadyMontagem() {
            const containerSelect = document.querySelector('select[name="ready-container"]');
            const montagemDiv = document.getElementById('ready-montagem');
            const montagemSelect = document.querySelector('select[name="ready-montagem-select"]');
            
            if (containerSelect && containerSelect.value === 'tigela') {
                montagemDiv.classList.remove('hidden');
                montagemSelect.required = true;
            } else {
                montagemDiv.classList.add('hidden');
                montagemSelect.required = false;
                montagemSelect.value = '';
            }
        }

        function updateReadyOptionPrice() {
            if (!currentHighlight) return;
            
            const containerSelect = document.querySelector('select[name="ready-container"]');
            const sizeSelect = document.querySelector('select[name="ready-size"]');
            const montagemSelect = document.querySelector('select[name="ready-montagem-select"]');
            
            // For batido, only check size
            if (currentHighlight.title === 'Batido') {
                if (sizeSelect && sizeSelect.value) {
                    const price = currentHighlight.basePrice;
                    document.getElementById('highlight-add-text').textContent = `Adicionar - R$ ${price.toFixed(2).replace('.', ',')}`;
                } else {
                    document.getElementById('highlight-add-text').textContent = 'Selecione o tamanho';
                }
                return;
            }
            
            // For other ready options, check container
            let allFieldsFilled = containerSelect && containerSelect.value;
            
            // If tigela is selected, also check montagem
            if (containerSelect && containerSelect.value === 'tigela') {
                allFieldsFilled = allFieldsFilled && montagemSelect && montagemSelect.value;
            }
            
            // Update price if all required fields are selected
            if (allFieldsFilled) {
                const price = currentHighlight.basePrice;
                document.getElementById('highlight-add-text').textContent = `Adicionar - R$ ${price.toFixed(2).replace('.', ',')}`;
            } else {
                document.getElementById('highlight-add-text').textContent = 'Selecione as opções';
            }
        }

        // Highlight modal functions
        function openHighlightModal(highlightType) {
            const highlights = {
                'batido-especial': {
                    title: 'Batido',
                    description: 'Açaí cremoso batido com leite, banana e leite condensado — refrescante e delicioso.',
                    image: '🥤',
                    ingredients: ['Açaí', 'Leite', 'Banana', 'Leite Condensado'],
                    prices: {
                        '300ml': 13.00,
                        '500ml': 15.00
                    }
                },
                'tradicional': {
                    title: 'Tradicional',
                    description: 'Sabor clássico e equilibrado, o favorito de quem gosta do açaí raiz.',
                    image: '🍓',
                    ingredients: ['Banana', 'Leite em Pó', 'Leite Condensado', 'Granola'],
                    prices: {
                        '350ml': 23.00,
                        '500ml': 25.00,
                        '750ml': 28.00
                    }
                },
                'especial': {
                    title: 'Especial',
                    description: 'Mistura tropical e cremosa com o toque irresistível da Nutella.',
                    image: '🥜',
                    ingredients: ['Morango', 'Kiwi', 'Manga', 'Amendoim', 'Nutella', 'Calda de Chocolate'],
                    prices: {
                        '350ml': 28.00,
                        '500ml': 30.00,
                        '750ml': 33.00
                    }
                },
                'kids': {
                    title: 'Kids',
                    description: 'Colorido, divertido e doce na medida certa — sucesso com a criançada.',
                    image: '🍭',
                    ingredients: ['Banana', 'Morango', 'Confete', 'Jujuba', 'Sucrilhos', 'Fini Beijos'],
                    prices: {
                        '350ml': 27.00,
                        '500ml': 29.00,
                        '750ml': 32.00
                    }
                },
                'premium': {
                    title: 'Premium',
                    description: 'Camadas ricas e crocantes, um açaí digno de foto — o mais completo da casa.',
                    image: '👑',
                    ingredients: ['Uva', 'Abacaxi', 'Kiwi', 'Sucrilhos', 'Paçoca', 'Leite em Pó', 'Nutella', 'Fini Banana'],
                    prices: {
                        '350ml': 38.00,
                        '500ml': 40.00,
                        '750ml': 43.00
                    }
                },
                'tropical': {
                    title: 'Tropical',
                    description: 'Refrescante e equilibrado — combina o sabor das frutas com doçura cremosa.',
                    image: '🥥',
                    ingredients: ['Uva', 'Abacaxi', 'Kiwi', 'Amendoim', 'Paçoca', 'Leite em Pó', 'Leite Condensado'],
                    prices: {
                        '350ml': 30.00,
                        '500ml': 32.00,
                        '750ml': 35.00
                    }
                }
            };
            
            currentHighlight = highlights[highlightType];
            
            // Update modal content
            document.getElementById('highlight-modal-title').textContent = currentHighlight.title;
            document.getElementById('highlight-modal-subtitle').textContent = 'Escolha o tamanho e recipiente';
            
            // Populate modal body
            const modalBody = document.getElementById('highlight-modal-body');
            modalBody.innerHTML = `
                <!-- Description -->
                <div class="text-center">
                    <p class="text-gray-700 leading-relaxed mb-4">${currentHighlight.description}</p>
                </div>
                
                <!-- Ingredients -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-primary mb-3">🥄 O QUE VEM NESTE AÇAÍ:</h3>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="flex flex-wrap gap-2">
                            ${currentHighlight.ingredients.map(ingredient => `
                                <span class="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">${ingredient}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
                

                
                ${currentHighlight.title === 'Batido' ? `
                    <!-- Size Selection for Batido -->
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-primary mb-3">📏 TAMANHO <span class="text-red-500">*</span></h3>
                        <select name="highlight-size" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="updateHighlightPrice()">
                            <option value="">Escolha o tamanho...</option>
                            ${Object.keys(currentHighlight.prices).map(size => 
                                `<option value="${size}">${size} - R$ ${currentHighlight.prices[size].toFixed(2).replace('.', ',')}</option>`
                            ).join('')}
                        </select>
                    </div>
                ` : `
                    <!-- Container Selection -->
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-primary mb-3">🥄 RECIPIENTE <span class="text-red-500">*</span></h3>
                        <select name="highlight-container" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="toggleHighlightMontagem(); updateHighlightPrice()">
                            <option value="">Escolha o recipiente...</option>
                            <option value="tigela">🥄 Tigela</option>
                            <option value="copo">🥤 Copo</option>
                        </select>
                    </div>

                    <!-- Montagem (only for tigela) -->
                    <div id="highlight-montagem" class="mb-6 hidden">
                        <h3 class="text-lg font-bold text-primary mb-3">🥄 COMO VOCÊ QUER SEU AÇAÍ? <span class="text-red-500">*</span></h3>
                        <select name="highlight-montagem-select" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="updateHighlightPrice()">
                            <option value="">Selecione como quer seu açaí...</option>
                            <option value="montado">Montado - Açaí já misturado com os complementos</option>
                            <option value="separado">Separado - Açaí e complementos em recipientes separados</option>
                        </select>
                    </div>

                    <!-- Size Selection -->
                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-primary mb-3">📏 TAMANHO <span class="text-red-500">*</span></h3>
                        <select name="highlight-size" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="updateHighlightPrice()">
                            <option value="">Escolha o tamanho...</option>
                            ${Object.keys(currentHighlight.prices).map(size => 
                                `<option value="${size}">${size} - R$ ${currentHighlight.prices[size].toFixed(2).replace('.', ',')}</option>`
                            ).join('')}
                        </select>
                    </div>
                `}
                

            `;
            
            // Reset add button
            document.getElementById('highlight-add-text').textContent = 'Selecione as opções';
            
            // Show modal with animation
            const modal = document.getElementById('highlight-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('highlight-modal-content').classList.remove('translate-y-full');
                // Reset scroll position to top after modal is visible
                const modalBody = document.getElementById('highlight-modal-body');
                modalBody.scrollTop = 0;
            }, 10);
        }
        
        function closeHighlightModal() {
            const modal = document.getElementById('highlight-modal');
            const modalContent = document.getElementById('highlight-modal-content');
            
            modalContent.classList.add('translate-y-full');
            setTimeout(() => {
                modal.classList.add('hidden');
                currentHighlight = null;
            }, 300);
        }
        
        function toggleHighlightMontagem() {
            const containerSelect = document.querySelector('select[name="highlight-container"]');
            const montagemDiv = document.getElementById('highlight-montagem');
            const montagemSelect = document.querySelector('select[name="highlight-montagem-select"]');
            
            if (containerSelect && containerSelect.value === 'tigela') {
                montagemDiv.classList.remove('hidden');
                montagemSelect.required = true;
            } else {
                montagemDiv.classList.add('hidden');
                montagemSelect.required = false;
                montagemSelect.value = '';
            }
        }

        function updateHighlightPrice() {
            if (!currentHighlight) return;
            
            const containerSelect = document.querySelector('select[name="highlight-container"]');
            const sizeSelect = document.querySelector('select[name="highlight-size"]');
            const montagemSelect = document.querySelector('select[name="highlight-montagem-select"]');
            
            // For batido, only check size
            if (currentHighlight.title === 'Batido') {
                if (sizeSelect && sizeSelect.value) {
                    const price = currentHighlight.prices[sizeSelect.value];
                    document.getElementById('highlight-add-text').textContent = `Adicionar - R$ ${price.toFixed(2).replace('.', ',')}`;
                } else {
                    document.getElementById('highlight-add-text').textContent = 'Selecione o tamanho';
                }
                return;
            }
            
            // For other highlights, check container and size
            let allFieldsFilled = containerSelect && sizeSelect && containerSelect.value && sizeSelect.value;
            
            // If tigela is selected, also check montagem
            if (containerSelect && containerSelect.value === 'tigela') {
                allFieldsFilled = allFieldsFilled && montagemSelect && montagemSelect.value;
            }
            
            // Update price if all required fields are selected
            if (allFieldsFilled) {
                const price = currentHighlight.prices[sizeSelect.value];
                document.getElementById('highlight-add-text').textContent = `Adicionar - R$ ${price.toFixed(2).replace('.', ',')}`;
            } else {
                document.getElementById('highlight-add-text').textContent = 'Selecione as opções';
            }
        }

        function addHighlightToCart() {
            if (!currentHighlight) return;
            
            // Handle combo items
            if (currentHighlight.type === 'combo') {
                const containerSelect = document.querySelector('select[name="combo-container"]');
                const montagemSelect = document.querySelector('select[name="combo-montagem-select"]');
                
                // Validate container selection
                if (!containerSelect || !containerSelect.value) {
                    showMessage('Por favor, escolha o recipiente!');
                    containerSelect.focus();
                    return;
                }
                
                // Validate montagem for tigela
                if (containerSelect.value === 'tigela' && (!montagemSelect || !montagemSelect.value)) {
                    showMessage('Por favor, escolha como você quer seus açaís: montado ou separado!');
                    montagemSelect.focus();
                    return;
                }
                
                const containerText = containerSelect.value === 'tigela' ? 'Tigela' : 'Copo';
                
                // Create cart item for combo
                const cartItem = {
                    category: `${currentHighlight.name} - ${containerText}`,
                    selections: [],
                    total: currentHighlight.price
                };
                
                // Add combo base
                cartItem.selections.push({
                    type: 'combo-base',
                    text: `${currentHighlight.items.length} itens - ${containerText}`,
                    price: currentHighlight.price
                });
                
                // Add montagem for tigela
                if (containerSelect.value === 'tigela' && montagemSelect && montagemSelect.value) {
                    const montagemText = montagemSelect.value === 'montado' ? 'Montado (todos já misturados)' : 'Separado (todos separados)';
                    cartItem.selections.push({
                        type: 'montagem',
                        text: montagemText,
                        price: 0
                    });
                }
                
                // Add combo items as included
                currentHighlight.items.forEach(item => {
                    cartItem.selections.push({
                        type: 'combo-items',
                        text: item,
                        price: 0
                    });
                });
                
                // Add to cart
                cartItems.push(cartItem);
                
                closeHighlightModal();
                updateCartDisplay();
                
                showMessage(`${currentHighlight.name} adicionado à sacola! 🎉`);
                return;
            }
            
            // Check if this is a ready option or custom highlight
            const containerSelect = document.querySelector('select[name="highlight-container"]') || document.querySelector('select[name="ready-container"]');
            const sizeSelect = document.querySelector('select[name="highlight-size"]') || document.querySelector('select[name="ready-size"]');
            const montagemSelect = document.querySelector('select[name="highlight-montagem-select"]') || document.querySelector('select[name="ready-montagem-select"]');
            
            // For batido (both custom and ready), only validate size
            if (currentHighlight.title === 'Batido') {
                if (!sizeSelect || !sizeSelect.value) {
                    showMessage('Por favor, escolha o tamanho!');
                    sizeSelect.focus();
                    return;
                }
                
                const selectedPrice = currentHighlight.basePrice || currentHighlight.prices[sizeSelect.value];
                
                // Create cart item for batido
                const cartItem = {
                    category: `${currentHighlight.title} - ${sizeSelect.value}`,
                    selections: [],
                    total: selectedPrice
                };
                
                // Add base item
                cartItem.selections.push({
                    type: 'batido-base',
                    text: sizeSelect.value,
                    price: selectedPrice
                });
                
                // Add ingredients as included items
                currentHighlight.ingredients.forEach(ingredient => {
                    cartItem.selections.push({
                        type: 'ingredientes-inclusos',
                        text: ingredient,
                        price: 0
                    });
                });
                
                // Add to cart
                cartItems.push(cartItem);
                
                closeHighlightModal();
                updateCartDisplay();
                
                showMessage(`${currentHighlight.title} adicionado à sacola! 🎉`);
                return;
            }
            
            // For other highlights (both custom and ready), validate all fields
            if (!containerSelect || !containerSelect.value) {
                showMessage('Por favor, escolha o recipiente!');
                containerSelect.focus();
                return;
            }
            
            // Validate montagem for tigela
            if (containerSelect.value === 'tigela' && (!montagemSelect || !montagemSelect.value)) {
                showMessage('Por favor, escolha como você quer seu açaí: montado ou separado!');
                montagemSelect.focus();
                return;
            }
            
            // For ready options, size is fixed at 500ml
            let selectedPrice, sizeText;
            if (currentHighlight.basePrice) {
                // Ready option
                selectedPrice = currentHighlight.basePrice;
                sizeText = '500ml';
            } else {
                // Custom highlight
                if (!sizeSelect || !sizeSelect.value) {
                    showMessage('Por favor, escolha o tamanho!');
                    sizeSelect.focus();
                    return;
                }
                selectedPrice = currentHighlight.prices[sizeSelect.value];
                sizeText = sizeSelect.value;
            }
            
            const containerText = containerSelect.value === 'tigela' ? 'Tigela' : 'Copo';
            
            // Create cart item
            const cartItem = {
                category: `${currentHighlight.title} - ${containerText} ${sizeText}`,
                selections: [],
                total: selectedPrice
            };
            
            // Add base item
            cartItem.selections.push({
                type: `${containerSelect.value}-base`,
                text: `${containerText} ${sizeText}`,
                price: selectedPrice
            });
            
            // Add montagem for tigela
            if (containerSelect.value === 'tigela' && montagemSelect && montagemSelect.value) {
                const montagemText = montagemSelect.value === 'montado' ? 'Montado (açaí já misturado)' : 'Separado (açaí e complementos separados)';
                cartItem.selections.push({
                    type: 'montagem',
                    text: montagemText,
                    price: 0
                });
            }
            
            // Add ingredients as included items
            currentHighlight.ingredients.forEach(ingredient => {
                cartItem.selections.push({
                    type: 'ingredientes-inclusos',
                    text: ingredient,
                    price: 0
                });
            });
            
            // Add to cart
            cartItems.push(cartItem);
            
            closeHighlightModal();
            updateCartDisplay();
            
            showMessage(`${currentHighlight.title} adicionado à sacola! 🎉`);
        }

        function openMaisPedidosModal(size, basePrice) {
            currentModalCategory = 'mais-pedidos';
            currentModalBasePrice = basePrice;
            
            // Reset free counts
            maisPedidosFreeCounts = { frutas: 0, complementos: 0, coberturas: 0 };
            
            // Update modal title
            document.getElementById('modal-title').textContent = '⭐ Mais Pedidos';
            document.getElementById('modal-subtitle').textContent = `${size} - R$ ${basePrice.toFixed(2).replace('.', ',')}`;
            
            // Clear previous selections
            const modal = document.getElementById('complementos-modal');
            const modalInputs = modal.querySelectorAll('input[type="checkbox"]');
            modalInputs.forEach(input => input.checked = false);
            
            // Populate modal content for Mais Pedidos
            populateMaisPedidosContent(size);
            
            // Show modal with animation
            modal.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('modal-content').classList.remove('translate-y-full');
                const modalBody = document.getElementById('modal-body');
                modalBody.scrollTop = 0;
            }, 10);
            
            updateMaisPedidosTotal();
        }

        function populateMaisPedidosContent(size) {
            const modalBody = document.getElementById('modal-body');
            
            const content = `
                <!-- Recipiente (Obrigatório) -->
                <div>
                    <h3 class="text-lg font-bold text-primary mb-4">🥄 RECIPIENTE <span class="text-red-500">*</span></h3>
                    <div class="mb-6">
                        <select name="mais-pedidos-recipiente" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="toggleMaisPedidosMontagem(); updateMaisPedidosTotal()">
                            <option value="">Escolha o recipiente...</option>
                            <option value="tigela">🥄 Tigela</option>
                            <option value="copo">🥤 Copo</option>
                        </select>
                    </div>
                </div>

                <!-- Montagem (Obrigatório para Tigela) -->
                <div id="mais-pedidos-montagem" class="hidden">
                    <h3 class="text-lg font-bold text-primary mb-4">🥄 COMO VOCÊ QUER SEU AÇAÍ? <span class="text-red-500">*</span></h3>
                    <div class="mb-6">
                        <select name="mais-pedidos-montagem-select" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="updateMaisPedidosTotal()">
                            <option value="">Selecione como quer seu açaí...</option>
                            <option value="montado">Montado - Açaí já misturado com os complementos</option>
                            <option value="separado">Separado - Açaí e complementos em recipientes separados</option>
                        </select>
                    </div>
                </div>

                <!-- Frutas -->
                <div>
                    <h3 class="text-lg font-bold text-primary mb-2">🍓 FRUTAS</h3>
                    <p class="text-sm text-green-600 font-medium mb-4">✓ 2 frutas GRÁTIS incluídas! Adicione mais por R$ 2,00 cada</p>
                    <div class="space-y-3">
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-frutas" value="banana-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Banana</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-price">GRÁTIS</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-frutas" value="morango-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Morango</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-price">GRÁTIS</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-frutas" value="uva-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Uva</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-price">R$ 2,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-frutas" value="abacaxi-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Abacaxi</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-price">R$ 2,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-frutas" value="kiwi-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Kiwi</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-price">R$ 2,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-frutas" value="manga-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Manga</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-price">R$ 2,00</span>
                        </label>
                    </div>
                </div>

                <!-- Complementos -->
                <div>
                    <h3 class="text-lg font-bold text-primary mb-2">🥜 COMPLEMENTOS</h3>
                    <p class="text-sm text-green-600 font-medium mb-4">✓ 2 complementos GRÁTIS incluídos! Adicione mais pagando o valor</p>
                    <div class="space-y-3">
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-complementos" value="amendoim-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Amendoim</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-comp-price">GRÁTIS</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-complementos" value="confete-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Confete</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-comp-price">GRÁTIS</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-complementos" value="granola-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Granola</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-comp-price">R$ 2,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-complementos" value="jujuba-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Jujuba</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-comp-price">R$ 2,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-complementos" value="sucrilos-3" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Sucrilos</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-comp-price">R$ 3,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-complementos" value="pacoca-3" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Paçoca</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-comp-price">R$ 3,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-complementos" value="leite-po-4" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Leite em pó</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-comp-price">R$ 4,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-complementos" value="nutella-6" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Nutella</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-comp-price">R$ 6,00</span>
                        </label>
                    </div>
                </div>

                <!-- Coberturas -->
                <div>
                    <h3 class="text-lg font-bold text-primary mb-2">🍯 COBERTURAS</h3>
                    <p class="text-sm text-green-600 font-medium mb-4">✓ 1 cobertura GRÁTIS incluída! Adicione mais pagando o valor</p>
                    <div class="space-y-3">
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-coberturas" value="caramelo-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Caramelo</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-cob-price">GRÁTIS</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-coberturas" value="morango-cobertura-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Morango</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-cob-price">R$ 2,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-coberturas" value="chocolate-2" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Chocolate</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-cob-price">R$ 2,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-coberturas" value="leite-condensado-3" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Leite condensado</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-cob-price">R$ 3,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-coberturas" value="fini-banana-4" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Fini Banana</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-cob-price">R$ 4,00</span>
                        </label>
                        <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                            <div class="flex items-center">
                                <input type="checkbox" name="mais-pedidos-coberturas" value="fini-beijos-4" class="mr-3 text-primary" onchange="updateMaisPedidosTotal()">
                                <span>Fini Beijos</span>
                            </div>
                            <span class="text-primary font-bold mais-pedidos-cob-price">R$ 4,00</span>
                        </label>
                    </div>
                </div>
            `;
            
            modalBody.innerHTML = content;
        }

        function toggleMaisPedidosMontagem() {
            const recipienteSelect = document.querySelector('select[name="mais-pedidos-recipiente"]');
            const montagemDiv = document.getElementById('mais-pedidos-montagem');
            const montagemSelect = document.querySelector('select[name="mais-pedidos-montagem-select"]');
            
            if (recipienteSelect && recipienteSelect.value === 'tigela') {
                montagemDiv.classList.remove('hidden');
                montagemSelect.required = true;
            } else {
                montagemDiv.classList.add('hidden');
                montagemSelect.required = false;
                montagemSelect.value = '';
            }
        }

        function updateMaisPedidosTotal() {
            const modal = document.getElementById('complementos-modal');
            
            // Count selected items
            const frutasChecked = modal.querySelectorAll('input[name="mais-pedidos-frutas"]:checked');
            const complementosChecked = modal.querySelectorAll('input[name="mais-pedidos-complementos"]:checked');
            const coberturasChecked = modal.querySelectorAll('input[name="mais-pedidos-coberturas"]:checked');
            
            // Update free counts
            maisPedidosFreeCounts.frutas = Math.min(frutasChecked.length, 2);
            maisPedidosFreeCounts.complementos = Math.min(complementosChecked.length, 2);
            maisPedidosFreeCounts.coberturas = Math.min(coberturasChecked.length, 1);
            
            // Update price labels for frutas
            const frutasLabels = modal.querySelectorAll('input[name="mais-pedidos-frutas"]');
            frutasLabels.forEach((input, index) => {
                const priceSpan = input.closest('label').querySelector('.mais-pedidos-price');
                if (input.checked) {
                    if (index < 2) {
                        priceSpan.textContent = 'GRÁTIS';
                        priceSpan.classList.remove('text-primary');
                        priceSpan.classList.add('text-green-600');
                    } else {
                        priceSpan.textContent = 'R$ 2,00';
                        priceSpan.classList.remove('text-green-600');
                        priceSpan.classList.add('text-primary');
                    }
                } else {
                    // Reset to show what it would be if selected
                    const checkedCount = modal.querySelectorAll('input[name="mais-pedidos-frutas"]:checked').length;
                    if (checkedCount < 2) {
                        priceSpan.textContent = 'GRÁTIS';
                        priceSpan.classList.remove('text-primary');
                        priceSpan.classList.add('text-green-600');
                    } else {
                        priceSpan.textContent = 'R$ 2,00';
                        priceSpan.classList.remove('text-green-600');
                        priceSpan.classList.add('text-primary');
                    }
                }
            });
            
            // Update price labels for complementos
            const complementosLabels = modal.querySelectorAll('input[name="mais-pedidos-complementos"]');
            complementosLabels.forEach((input, index) => {
                const priceSpan = input.closest('label').querySelector('.mais-pedidos-comp-price');
                const parts = input.value.split('-');
                const itemPrice = parseFloat(parts[parts.length - 1]);
                
                if (input.checked) {
                    const checkedBefore = Array.from(complementosLabels).slice(0, index).filter(i => i.checked).length;
                    if (checkedBefore < 2) {
                        priceSpan.textContent = 'GRÁTIS';
                        priceSpan.classList.remove('text-primary');
                        priceSpan.classList.add('text-green-600');
                    } else {
                        priceSpan.textContent = `R$ ${itemPrice.toFixed(2).replace('.', ',')}`;
                        priceSpan.classList.remove('text-green-600');
                        priceSpan.classList.add('text-primary');
                    }
                } else {
                    const checkedCount = modal.querySelectorAll('input[name="mais-pedidos-complementos"]:checked').length;
                    if (checkedCount < 2) {
                        priceSpan.textContent = 'GRÁTIS';
                        priceSpan.classList.remove('text-primary');
                        priceSpan.classList.add('text-green-600');
                    } else {
                        priceSpan.textContent = `R$ ${itemPrice.toFixed(2).replace('.', ',')}`;
                        priceSpan.classList.remove('text-green-600');
                        priceSpan.classList.add('text-primary');
                    }
                }
            });
            
            // Update price labels for coberturas
            const coberturasLabels = modal.querySelectorAll('input[name="mais-pedidos-coberturas"]');
            coberturasLabels.forEach((input, index) => {
                const priceSpan = input.closest('label').querySelector('.mais-pedidos-cob-price');
                const parts = input.value.split('-');
                const itemPrice = parseFloat(parts[parts.length - 1]);
                
                if (input.checked) {
                    if (index === 0 && coberturasChecked.length === 1) {
                        priceSpan.textContent = 'GRÁTIS';
                        priceSpan.classList.remove('text-primary');
                        priceSpan.classList.add('text-green-600');
                    } else {
                        priceSpan.textContent = `R$ ${itemPrice.toFixed(2).replace('.', ',')}`;
                        priceSpan.classList.remove('text-green-600');
                        priceSpan.classList.add('text-primary');
                    }
                } else {
                    const checkedCount = modal.querySelectorAll('input[name="mais-pedidos-coberturas"]:checked').length;
                    if (checkedCount < 1) {
                        priceSpan.textContent = 'GRÁTIS';
                        priceSpan.classList.remove('text-primary');
                        priceSpan.classList.add('text-green-600');
                    } else {
                        priceSpan.textContent = `R$ ${itemPrice.toFixed(2).replace('.', ',')}`;
                        priceSpan.classList.remove('text-green-600');
                        priceSpan.classList.add('text-primary');
                    }
                }
            });
            
            // Calculate total
            let modalTotal = currentModalBasePrice;
            
            // Add paid frutas (after first 2)
            frutasChecked.forEach((input, index) => {
                if (index >= 2) {
                    modalTotal += 2.00;
                }
            });
            
            // Add paid complementos (after first 2)
            complementosChecked.forEach((input, index) => {
                if (index >= 2) {
                    const parts = input.value.split('-');
                    const price = parseFloat(parts[parts.length - 1]);
                    modalTotal += price;
                }
            });
            
            // Add paid coberturas (after first 1)
            coberturasChecked.forEach((input, index) => {
                if (index >= 1) {
                    const parts = input.value.split('-');
                    const price = parseFloat(parts[parts.length - 1]);
                    modalTotal += price;
                }
            });
            
            document.getElementById('modal-add-text').textContent = `Adicionar - R$ ${modalTotal.toFixed(2).replace('.', ',')}`;
        }

        function openComplementosModal(category, size, basePrice) {
            currentModalCategory = category;
            currentModalBasePrice = basePrice;
            
            // Update modal title
            const categoryNames = {
                'tigela': 'Açaí na Tigela',
                'copo': 'Açaí no Copo', 
                'batido': 'Açaí Batido'
            };
            
            document.getElementById('modal-title').textContent = categoryNames[category];
            document.getElementById('modal-subtitle').textContent = `${size} - R$ ${basePrice.toFixed(2).replace('.', ',')}`;
            
            // Clear previous selections
            const modal = document.getElementById('complementos-modal');
            const modalInputs = modal.querySelectorAll('input[type="checkbox"]');
            modalInputs.forEach(input => input.checked = false);
            
            // Populate modal content
            populateModalContent(category);
            
            // Show modal with animation
            modal.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('modal-content').classList.remove('translate-y-full');
                // Reset scroll position to top after modal is visible
                const modalBody = document.getElementById('modal-body');
                modalBody.scrollTop = 0;
            }, 10);
            
            updateModalTotal();
        }

        function closeComplementosModal() {
            const modal = document.getElementById('complementos-modal');
            const modalContent = document.getElementById('modal-content');
            
            modalContent.classList.add('translate-y-full');
            setTimeout(() => {
                modal.classList.add('hidden');
                
                // Reset editing state and button appearance
                editingItemIndex = -1;
                const addButton = document.getElementById('modal-add-button');
                const addText = document.getElementById('modal-add-text');
                addButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                addButton.classList.add('bg-secondary', 'hover:bg-yellow-500');
                addText.textContent = addText.textContent.replace('Salvar Alterações', 'Adicionar');
            }, 300);
        }

        function populateModalContent(category) {
            const modalBody = document.getElementById('modal-body');
            let content = '';
            
            if (category === 'tigela') {
                content = `
                    <!-- Montagem (Obrigatório para Tigela) -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🥄 COMO VOCÊ QUER SEU AÇAÍ? <span class="text-red-500">*</span></h3>
                        <div class="mb-6">
                            <select name="modal-montagem" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="updateModalTotal()">
                                <option value="">Selecione como quer seu açaí...</option>
                                <option value="montado">Montado - Açaí já misturado com os complementos</option>
                                <option value="separado">Separado - Açaí e complementos em recipientes separados</option>
                            </select>
                        </div>
                    </div>

                    <!-- Frutas -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🍓 FRUTAS</h3>
                        <div class="space-y-3">
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="banana-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Banana</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="morango-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Morango</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="uva-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Uva</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="abacaxi-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Abacaxi</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="kiwi-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Kiwi</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="manga-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Manga</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                        </div>
                    </div>

                    <!-- Complementos -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🥜 COMPLEMENTOS</h3>
                        <div class="space-y-3">
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="amendoim-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Amendoim</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="confete-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Confete</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="granola-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Granola</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="jujuba-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Jujuba</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="sucrilos-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Sucrilos</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="pacoca-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Paçoca</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="leite-po-4" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Leite em pó</span>
                                </div>
                                <span class="text-primary font-bold">R$ 4,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="nutella-6" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Nutella</span>
                                </div>
                                <span class="text-primary font-bold">R$ 6,00</span>
                            </label>
                        </div>
                    </div>

                    <!-- Coberturas -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🍯 COBERTURAS</h3>
                        <div class="space-y-3">
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="caramelo-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Caramelo</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="morango-cobertura-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Morango</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="chocolate-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Chocolate</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="leite-condensado-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Leite condensado</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="fini-banana-4" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Fini Banana</span>
                                </div>
                                <span class="text-primary font-bold">R$ 4,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="fini-beijos-4" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Fini Beijos</span>
                                </div>
                                <span class="text-primary font-bold">R$ 4,00</span>
                            </label>
                        </div>
                    </div>
                `;
            } else if (category === 'copo') {
                content = `
                    <!-- Frutas -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🍓 FRUTAS</h3>
                        <div class="space-y-3">
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="banana-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Banana</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="morango-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Morango</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="uva-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Uva</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="abacaxi-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Abacaxi</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="kiwi-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Kiwi</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="manga-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Manga</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                        </div>
                    </div>

                    <!-- Complementos -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🥜 COMPLEMENTOS</h3>
                        <div class="space-y-3">
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="amendoim-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Amendoim</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="confete-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Confete</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="granola-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Granola</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="jujuba-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Jujuba</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="sucrilos-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Sucrilos</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="pacoca-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Paçoca</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="leite-po-4" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Leite em pó</span>
                                </div>
                                <span class="text-primary font-bold">R$ 4,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-complementos" value="nutella-6" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Nutella</span>
                                </div>
                                <span class="text-primary font-bold">R$ 6,00</span>
                            </label>
                        </div>
                    </div>

                    <!-- Coberturas -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🍯 COBERTURAS</h3>
                        <div class="space-y-3">
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="caramelo-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Caramelo</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="morango-cobertura-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Morango</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="chocolate-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Chocolate</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="leite-condensado-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Leite condensado</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="fini-banana-4" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Fini Banana</span>
                                </div>
                                <span class="text-primary font-bold">R$ 4,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="fini-beijos-4" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Fini Beijos</span>
                                </div>
                                <span class="text-primary font-bold">R$ 4,00</span>
                            </label>
                        </div>
                    </div>
                `;
            } else if (category === 'batido') {
                content = `
                    <!-- Frutas -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🍓 FRUTAS</h3>
                        <div class="space-y-3">
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="banana-1" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Banana</span>
                                </div>
                                <span class="text-primary font-bold">R$ 1,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="morango-1" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Morango</span>
                                </div>
                                <span class="text-primary font-bold">R$ 1,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="uva-1" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Uva</span>
                                </div>
                                <span class="text-primary font-bold">R$ 1,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="abacaxi-1" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Abacaxi</span>
                                </div>
                                <span class="text-primary font-bold">R$ 1,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="kiwi-1" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Kiwi</span>
                                </div>
                                <span class="text-primary font-bold">R$ 1,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-frutas" value="manga-1" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Manga</span>
                                </div>
                                <span class="text-primary font-bold">R$ 1,00</span>
                            </label>
                        </div>
                    </div>

                    <!-- Adicionais -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🥜 ADICIONAIS</h3>
                        <div class="space-y-3">
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-adicionais" value="pacoca-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Paçoca</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-adicionais" value="nutella-6" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Nutella</span>
                                </div>
                                <span class="text-primary font-bold">R$ 6,00</span>
                            </label>
                        </div>
                    </div>

                    <!-- Coberturas -->
                    <div>
                        <h3 class="text-lg font-bold text-primary mb-4">🍯 COBERTURAS</h3>
                        <div class="space-y-3">
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="caramelo-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Caramelo</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="morango-cobertura-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Morango</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="chocolate-2" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Chocolate</span>
                                </div>
                                <span class="text-primary font-bold">R$ 2,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="leite-condensado-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Leite condensado</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="fini-banana-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Fini Banana</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                            <label class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                                <div class="flex items-center">
                                    <input type="checkbox" name="modal-coberturas" value="fini-beijos-3" class="mr-3 text-primary" onchange="updateModalTotal()">
                                    <span>Fini Beijos</span>
                                </div>
                                <span class="text-primary font-bold">R$ 3,00</span>
                            </label>
                        </div>
                    </div>
                `;
            }
            
            modalBody.innerHTML = content;
        }

        function updateModalTotal() {
            const modal = document.getElementById('complementos-modal');
            const checkedInputs = modal.querySelectorAll('input[type="checkbox"]:checked');
            
            let modalTotal = currentModalBasePrice;
            
            checkedInputs.forEach(input => {
                const parts = input.value.split('-');
                const price = parseFloat(parts[parts.length - 1]); // Pega o último elemento que é sempre o preço
                modalTotal += price;
            });
            
            document.getElementById('modal-add-text').textContent = `Adicionar - R$ ${modalTotal.toFixed(2).replace('.', ',')}`;
        }



        function addModalToCart() {
            const modal = document.getElementById('complementos-modal');
            
            // Handle Mais Pedidos category
            if (currentModalCategory === 'mais-pedidos') {
                const recipienteSelect = modal.querySelector('select[name="mais-pedidos-recipiente"]');
                if (!recipienteSelect || !recipienteSelect.value) {
                    showMessage('Por favor, escolha o recipiente!');
                    recipienteSelect.focus();
                    recipienteSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
                
                // Validate montagem for tigela
                if (recipienteSelect.value === 'tigela') {
                    const montagemSelect = modal.querySelector('select[name="mais-pedidos-montagem-select"]');
                    if (!montagemSelect || !montagemSelect.value) {
                        showMessage('Por favor, escolha como você quer seu açaí: montado ou separado!');
                        montagemSelect.focus();
                        montagemSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        return;
                    }
                }
                
                const frutasChecked = modal.querySelectorAll('input[name="mais-pedidos-frutas"]:checked');
                const complementosChecked = modal.querySelectorAll('input[name="mais-pedidos-complementos"]:checked');
                const coberturasChecked = modal.querySelectorAll('input[name="mais-pedidos-coberturas"]:checked');
                
                // Get modal subtitle to extract size info
                const modalSubtitle = document.getElementById('modal-subtitle').textContent;
                const sizeMatch = modalSubtitle.match(/(\d+ml)/);
                const size = sizeMatch ? sizeMatch[1] : '';
                
                const recipienteText = recipienteSelect.value === 'tigela' ? 'Tigela' : 'Copo';
                
                // Create cart item
                const cartItem = {
                    category: `⭐ Mais Pedidos - ${recipienteText} ${size}`,
                    selections: [],
                    total: 0
                };
                
                // Add base
                cartItem.selections.push({
                    type: 'mais-pedidos-base',
                    text: `${recipienteText} ${size}`,
                    price: currentModalBasePrice
                });
                
                // Add montagem for tigela
                if (recipienteSelect.value === 'tigela') {
                    const montagemSelect = modal.querySelector('select[name="mais-pedidos-montagem-select"]');
                    if (montagemSelect && montagemSelect.value) {
                        const montagemText = montagemSelect.value === 'montado' ? 'Montado (açaí já misturado)' : 'Separado (açaí e complementos separados)';
                        cartItem.selections.push({
                            type: 'montagem',
                            text: montagemText,
                            price: 0
                        });
                    }
                }
                
                // Add frutas (first 2 free, rest paid)
                frutasChecked.forEach((input, index) => {
                    const text = input.parentElement.querySelector('span').textContent;
                    const price = index < 2 ? 0 : 2.00;
                    
                    cartItem.selections.push({
                        type: index < 2 ? 'mais-pedidos-frutas-gratis' : 'mais-pedidos-frutas',
                        text: text + (index < 2 ? ' (GRÁTIS)' : ''),
                        price: price
                    });
                });
                
                // Add complementos (first 2 free, rest paid)
                complementosChecked.forEach((input, index) => {
                    const text = input.parentElement.querySelector('span').textContent;
                    const parts = input.value.split('-');
                    const itemPrice = parseFloat(parts[parts.length - 1]);
                    const price = index < 2 ? 0 : itemPrice;
                    
                    cartItem.selections.push({
                        type: index < 2 ? 'mais-pedidos-complementos-gratis' : 'mais-pedidos-complementos',
                        text: text + (index < 2 ? ' (GRÁTIS)' : ''),
                        price: price
                    });
                });
                
                // Add coberturas (first 1 free, rest paid)
                coberturasChecked.forEach((input, index) => {
                    const text = input.parentElement.querySelector('span').textContent;
                    const parts = input.value.split('-');
                    const itemPrice = parseFloat(parts[parts.length - 1]);
                    const price = index < 1 ? 0 : itemPrice;
                    
                    cartItem.selections.push({
                        type: index < 1 ? 'mais-pedidos-coberturas-gratis' : 'mais-pedidos-coberturas',
                        text: text + (index < 1 ? ' (GRÁTIS)' : ''),
                        price: price
                    });
                });
                
                // Calculate total
                cartItem.total = cartItem.selections.reduce((sum, selection) => sum + selection.price, 0);
                
                // Add to cart
                cartItems.push(cartItem);
                
                closeComplementosModal();
                updateCartDisplay();
                
                showMessage('Mais Pedidos adicionado à sacola! 🎉');
                return;
            }
            
            // Validate montagem selection for tigela
            if (currentModalCategory === 'tigela') {
                const montagemSelect = modal.querySelector('select[name="modal-montagem"]');
                if (!montagemSelect || !montagemSelect.value) {
                    showMessage('Por favor, escolha como você quer seu açaí: montado ou separado!');
                    // Focus and scroll to the montagem select
                    montagemSelect.focus();
                    montagemSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
            }
            
            const checkedInputs = modal.querySelectorAll('input[type="checkbox"]:checked');
            
            // Get modal subtitle to extract size info
            const modalSubtitle = document.getElementById('modal-subtitle').textContent;
            const sizeMatch = modalSubtitle.match(/(\d+ml)/);
            const size = sizeMatch ? sizeMatch[1] : '';
            
            // Create cart item
            const cartItem = {
                category: `Açaí ${currentModalCategory === 'tigela' ? 'na Tigela' : currentModalCategory === 'copo' ? 'no Copo' : 'Batido'} - ${size}`,
                selections: [],
                total: 0
            };
            
            // Add base
            cartItem.selections.push({
                type: `${currentModalCategory}-base`,
                text: size,
                price: currentModalBasePrice
            });
            
            // Add montagem selection for tigela
            if (currentModalCategory === 'tigela') {
                const montagemSelect = modal.querySelector('select[name="modal-montagem"]');
                if (montagemSelect && montagemSelect.value) {
                    const montagemText = montagemSelect.value === 'montado' ? 'Montado (açaí já misturado)' : 'Separado (açaí e complementos separados)';
                    cartItem.selections.push({
                        type: 'montagem',
                        text: montagemText,
                        price: 0
                    });
                }
            }
            
            // Add selected complementos
            checkedInputs.forEach(input => {
                const parts = input.value.split('-');
                const price = parseFloat(parts[parts.length - 1]); // Pega o último elemento que é sempre o preço
                const text = input.parentElement.querySelector('span').textContent;
                
                cartItem.selections.push({
                    type: input.name,
                    text: text,
                    price: price
                });
            });
            
            // Calculate total
            cartItem.total = cartItem.selections.reduce((sum, selection) => sum + selection.price, 0);
            
            // Check if we're editing an existing item
            if (editingItemIndex >= 0) {
                // Replace the existing item
                cartItems[editingItemIndex] = cartItem;
                editingItemIndex = -1; // Reset editing index
                
                closeComplementosModal();
                updateCartDisplay();
                
                showMessage('Alterações salvas com sucesso! ✅');
            } else {
                // Add new item to cart
                cartItems.push(cartItem);
                
                closeComplementosModal();
                updateCartDisplay();
                
                showMessage('Item adicionado à sacola!');
            }
        }



        function updateCartDisplay() {
            const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
            const promoDiscount = calculatePromoDiscount();
            total = subtotal - promoDiscount;
            
            // Sync with window for external access
            window.total = total;
            window.cartItems = cartItems;
            
            // Show/hide fixed cart button
            const fixedCartButton = document.getElementById('fixed-cart-button');
            const cartTotal = document.getElementById('cart-total');
            const cartButton = document.getElementById('cart-button');
            const promoSavings = document.getElementById('promo-savings');
            
            if (cartItems.length > 0) {
                fixedCartButton.classList.remove('hidden');
                cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
                
                // Show promo savings if applicable
                if (promoDiscount > 0) {
                    promoSavings.classList.remove('hidden');
                    promoSavings.textContent = `Economia: R$ ${promoDiscount.toFixed(2).replace('.', ',')}`;
                } else {
                    promoSavings.classList.add('hidden');
                }
                
                // Always keep "Ver Sacola" button active
                cartButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
                cartButton.classList.add('bg-secondary', 'hover:bg-yellow-500');
                cartButton.textContent = 'Ver Sacola';
            } else {
                fixedCartButton.classList.add('hidden');
            }
            
            console.log('Cart items:', cartItems.length, 'Subtotal:', subtotal, 'Discount:', promoDiscount, 'Total:', total); // Debug
        }

        function openCart() {
            if (total === 0) {
                showMessage('Selecione pelo menos um item para ver a sacola!');
                return;
            }
            
            updateCartPage();
            document.getElementById('cart-page').classList.remove('hidden');
        }

        function closeCart() {
            document.getElementById('cart-page').classList.add('hidden');
        }

        function updateCartPage() {
            const cartItemsDiv = document.getElementById('cart-items');
            const emptyCartDiv = document.getElementById('empty-cart');
            const cartPageTotal = document.getElementById('cart-page-total');
            const checkoutButton = document.getElementById('checkout-button');
            const checkoutButtonText = document.getElementById('checkout-button-text');
            
            cartItemsDiv.innerHTML = '';
            
            if (cartItems.length === 0) {
                cartItemsDiv.classList.add('hidden');
                emptyCartDiv.classList.remove('hidden');
                return;
            }
            
            cartItemsDiv.classList.remove('hidden');
            emptyCartDiv.classList.add('hidden');
            
            // Checkout button always active when there are items
            checkoutButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
            checkoutButton.classList.add('bg-green-500', 'hover:bg-green-600');
            checkoutButtonText.textContent = 'Finalizar Pedido';
            
            // Create cards for each cart item
            cartItems.forEach((cartItem, index) => {
                let categoryCard = `
                    <div class="bg-white rounded-xl p-4 card-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-lg font-bold text-primary">${cartItem.category}</h3>
                            <div class="flex space-x-2">
                                <button onclick="editCartItem(${index})" class="text-blue-500 hover:text-blue-700 font-medium text-sm bg-blue-50 px-3 py-1 rounded-lg">
                                    Editar
                                </button>
                                <button onclick="removeCartItem(${index})" class="text-red-500 hover:text-red-700 font-bold text-xl">×</button>
                            </div>
                        </div>
                        <div class="space-y-3">
                `;
                
                // Group items by type
                const items = {
                    base: [],
                    montagem: [],
                    ingredientes: [],
                    comboItems: [],
                    frutas: [],
                    complementos: [],
                    adicionais: [],
                    coberturas: []
                };
                
                cartItem.selections.forEach(selection => {
                    if (selection.type.includes('base')) {
                        items.base.push(selection);
                    } else if (selection.type === 'montagem') {
                        items.montagem.push(selection);
                    } else if (selection.type === 'ingredientes-inclusos') {
                        items.ingredientes.push(selection);
                    } else if (selection.type === 'combo-items') {
                        items.comboItems.push(selection);
                    } else if (selection.type.includes('frutas')) {
                        items.frutas.push(selection);
                    } else if (selection.type.includes('complementos')) {
                        items.complementos.push(selection);
                    } else if (selection.type.includes('adicionais')) {
                        items.adicionais.push(selection);
                    } else if (selection.type.includes('coberturas')) {
                        items.coberturas.push(selection);
                    }
                });
                
                // Add items to card
                if (items.base.length > 0) {
                    items.base.forEach(item => {
                        categoryCard += `
                            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                <span class="font-medium">${item.text}</span>
                                <span class="text-primary font-bold">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                        `;
                    });
                }
                
                if (items.montagem.length > 0) {
                    items.montagem.forEach(item => {
                        categoryCard += `
                            <div class="py-1 text-sm text-gray-600">
                                🥄 ${item.text}
                            </div>
                        `;
                    });
                }
                
                if (items.comboItems.length > 0) {
                    categoryCard += '<div class="text-sm font-medium text-gray-600 mt-3 mb-2">Itens do combo:</div>';
                    categoryCard += '<div class="space-y-1 mb-2">';
                    items.comboItems.forEach((item, index) => {
                        categoryCard += `
                            <div class="flex items-center">
                                <div class="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">
                                    ${index + 1}
                                </div>
                                <span class="text-sm">${item.text}</span>
                            </div>
                        `;
                    });
                    categoryCard += '</div>';
                }
                
                if (items.ingredientes.length > 0) {
                    categoryCard += '<div class="text-sm font-medium text-gray-600 mt-3 mb-2">Ingredientes inclusos:</div>';
                    categoryCard += '<div class="flex flex-wrap gap-1 mb-2">';
                    items.ingredientes.forEach(item => {
                        categoryCard += `
                            <span class="bg-gray-100 px-2 py-1 rounded text-xs">${item.text}</span>
                        `;
                    });
                    categoryCard += '</div>';
                }
                
                if (items.frutas.length > 0) {
                    categoryCard += '<div class="text-sm font-medium text-gray-600 mt-3 mb-2">Frutas:</div>';
                    items.frutas.forEach((item, itemIndex) => {
                        const selectionIndex = cartItem.selections.findIndex(s => s === item);
                        categoryCard += `
                            <div class="flex justify-between items-center py-1 pl-4">
                                <span>${item.text}</span>
                                <div class="flex items-center space-x-2">
                                    <span class="text-primary font-medium">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                                    <button onclick="removeComplement(${index}, ${selectionIndex})" class="text-red-500 hover:text-red-700 text-sm font-bold">×</button>
                                </div>
                            </div>
                        `;
                    });
                }
                
                if (items.complementos.length > 0) {
                    categoryCard += '<div class="text-sm font-medium text-gray-600 mt-3 mb-2">Complementos:</div>';
                    items.complementos.forEach((item, itemIndex) => {
                        const selectionIndex = cartItem.selections.findIndex(s => s === item);
                        categoryCard += `
                            <div class="flex justify-between items-center py-1 pl-4">
                                <span>${item.text}</span>
                                <div class="flex items-center space-x-2">
                                    <span class="text-primary font-medium">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                                    <button onclick="removeComplement(${index}, ${selectionIndex})" class="text-red-500 hover:text-red-700 text-sm font-bold">×</button>
                                </div>
                            </div>
                        `;
                    });
                }
                
                if (items.adicionais.length > 0) {
                    categoryCard += '<div class="text-sm font-medium text-gray-600 mt-3 mb-2">Adicionais:</div>';
                    items.adicionais.forEach((item, itemIndex) => {
                        const selectionIndex = cartItem.selections.findIndex(s => s === item);
                        categoryCard += `
                            <div class="flex justify-between items-center py-1 pl-4">
                                <span>${item.text}</span>
                                <div class="flex items-center space-x-2">
                                    <span class="text-primary font-medium">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                                    <button onclick="removeComplement(${index}, ${selectionIndex})" class="text-red-500 hover:text-red-700 text-sm font-bold">×</button>
                                </div>
                            </div>
                        `;
                    });
                }
                
                if (items.coberturas.length > 0) {
                    categoryCard += '<div class="text-sm font-medium text-gray-600 mt-3 mb-2">Coberturas:</div>';
                    items.coberturas.forEach((item, itemIndex) => {
                        const selectionIndex = cartItem.selections.findIndex(s => s === item);
                        categoryCard += `
                            <div class="flex justify-between items-center py-1 pl-4">
                                <span>${item.text}</span>
                                <div class="flex items-center space-x-2">
                                    <span class="text-primary font-medium">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                                    <button onclick="removeComplement(${index}, ${selectionIndex})" class="text-red-500 hover:text-red-700 text-sm font-bold">×</button>
                                </div>
                            </div>
                        `;
                    });
                }
                
                categoryCard += `
                        </div>
                    </div>
                `;
                
                cartItemsDiv.innerHTML += categoryCard;
            });
            
            // Update cart page total with promo info
            const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
            const promoDiscount = calculatePromoDiscount();
            
            if (promoDiscount > 0) {
                cartPageTotal.innerHTML = `
                    <div class="text-right">
                        <div class="text-sm text-gray-500">Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
                        <div class="text-sm text-green-600">Desconto: -R$ ${promoDiscount.toFixed(2).replace('.', ',')}</div>
                        <div class="text-2xl font-bold text-primary">R$ ${total.toFixed(2).replace('.', ',')}</div>
                    </div>
                `;
            } else {
                cartPageTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
            }
        }

        function removeCartItem(index) {
            cartItems.splice(index, 1);
            updateCartDisplay();
            updateCartPage();
            
            if (cartItems.length === 0) {
                closeCart();
            }
        }

        function removeComplement(cartIndex, selectionIndex) {
            const cartItem = cartItems[cartIndex];
            const removedItem = cartItem.selections[selectionIndex];
            
            // Don't allow removing base items or montagem
            if (removedItem.type.includes('base') || removedItem.type === 'montagem') {
                showMessage('Não é possível remover o item base. Use "Editar" para alterar o tamanho.');
                return;
            }
            
            // Remove the selection
            cartItem.selections.splice(selectionIndex, 1);
            
            // Recalculate item total
            cartItem.total = cartItem.selections.reduce((sum, selection) => sum + selection.price, 0);
            
            // Update displays
            updateCartDisplay();
            updateCartPage();
            
            showMessage(`${removedItem.text} removido!`);
        }

        let editingItemIndex = -1; // Track which item is being edited

        function editCartItem(index) {
            const cartItem = cartItems[index];
            editingItemIndex = index; // Store the index of item being edited
            
            // Extract category and size from cart item
            let category = '';
            let size = '';
            let basePrice = 0;
            
            if (cartItem.category.includes('Tigela')) {
                category = 'tigela';
            } else if (cartItem.category.includes('Copo')) {
                category = 'copo';
            } else if (cartItem.category.includes('Batido')) {
                category = 'batido';
            }
            
            // Find base selection to get size and price
            const baseSelection = cartItem.selections.find(s => s.type.includes('base'));
            if (baseSelection) {
                size = baseSelection.text;
                basePrice = baseSelection.price;
            }
            
            // Close cart and open modal with current selections
            closeCart();
            openComplementosModal(category, size, basePrice);
            
            // Pre-fill all current selections after modal opens
            setTimeout(() => {
                const modal = document.getElementById('complementos-modal');
                
                // Pre-fill montagem for tigela
                if (category === 'tigela') {
                    const montagemSelection = cartItem.selections.find(s => s.type === 'montagem');
                    if (montagemSelection) {
                        const montagemSelect = modal.querySelector('select[name="modal-montagem"]');
                        if (montagemSelect) {
                            if (montagemSelection.text.includes('Montado')) {
                                montagemSelect.value = 'montado';
                            } else if (montagemSelection.text.includes('Separado')) {
                                montagemSelect.value = 'separado';
                            }
                        }
                    }
                }
                
                // Pre-fill all complementos
                cartItem.selections.forEach(selection => {
                    if (!selection.type.includes('base') && selection.type !== 'montagem') {
                        // Find matching checkbox by comparing the selection text with checkbox labels
                        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
                        checkboxes.forEach(checkbox => {
                            const label = checkbox.parentElement.querySelector('span');
                            if (label && label.textContent.trim() === selection.text) {
                                checkbox.checked = true;
                            }
                        });
                    }
                });
                
                updateModalTotal();
                
                // Update button text to indicate editing
                const addButton = document.getElementById('modal-add-button');
                const addText = document.getElementById('modal-add-text');
                addButton.classList.remove('bg-secondary', 'hover:bg-yellow-500');
                addButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
                addText.textContent = addText.textContent.replace('Adicionar', 'Salvar Alterações');
                
            }, 100);
            
            showMessage('Editando item! Faça suas alterações e clique em "Salvar Alterações".');
        }

        function openCheckoutForm() {
            // Update checkout total
            updateCheckoutTotal();
            
            // Clear form
            document.getElementById('checkout-form').reset();
            
            // Hide conditional fields
            document.getElementById('delivery-address').classList.add('hidden');
            document.getElementById('change-field').classList.add('hidden');
            
            // Show checkout page
            document.getElementById('checkout-page').classList.remove('hidden');
            closeCart();
        }

        function closeCheckoutForm() {
            document.getElementById('checkout-page').classList.add('hidden');
        }

        function updateCheckoutTotal() {
            const deliverySelect = document.getElementById('delivery-type-select');
            const neighborhoodSelect = document.getElementById('neighborhood-select');
            const paymentSelect = document.getElementById('payment-method');
            let deliveryFee = 0;
            let pixDiscount = 0;
            
            if (deliverySelect && deliverySelect.value === 'delivery' && neighborhoodSelect && neighborhoodSelect.value) {
                const neighborhoodValue = neighborhoodSelect.value;
                const fee = neighborhoodValue.split('-')[1];
                deliveryFee = parseFloat(fee);
            }
            
            // Apply 2% PIX discount
            if (paymentSelect && paymentSelect.value === 'pix') {
                pixDiscount = total * 0.02;
            }
            
            const finalTotal = total + deliveryFee - pixDiscount;
            
            // Update main total
            document.getElementById('checkout-total').textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
            
            // Update summary breakdown
            document.getElementById('checkout-subtotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
            
            // Show/hide delivery fee
            const deliveryFeeDiv = document.getElementById('checkout-delivery-fee');
            const deliveryAmountSpan = document.getElementById('checkout-delivery-amount');
            if (deliveryFee > 0) {
                deliveryFeeDiv.classList.remove('hidden');
                deliveryAmountSpan.textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
            } else if (deliverySelect && deliverySelect.value === 'delivery') {
                deliveryFeeDiv.classList.remove('hidden');
                deliveryAmountSpan.textContent = 'Grátis';
            } else {
                deliveryFeeDiv.classList.add('hidden');
            }
            
            // Show/hide PIX discount
            const pixDiscountDiv = document.getElementById('checkout-pix-discount');
            const discountAmountSpan = document.getElementById('checkout-discount-amount');
            if (pixDiscount > 0) {
                pixDiscountDiv.classList.remove('hidden');
                discountAmountSpan.textContent = `-R$ ${pixDiscount.toFixed(2).replace('.', ',')}`;
            } else {
                pixDiscountDiv.classList.add('hidden');
            }
        }

        function toggleDeliveryFields() {
            const deliverySelect = document.getElementById('delivery-type-select');
            const addressDiv = document.getElementById('delivery-address');
            const neighborhoodList = document.getElementById('neighborhood-list');
            
            if (deliverySelect.value === 'delivery') {
                neighborhoodList.classList.remove('hidden');
                addressDiv.classList.remove('hidden');
                // Make address fields required
                document.getElementById('address-street').required = true;
                document.getElementById('address-number').required = true;
            } else {
                neighborhoodList.classList.add('hidden');
                addressDiv.classList.add('hidden');
                // Remove required from address fields
                document.getElementById('address-street').required = false;
                document.getElementById('address-number').required = false;
                // Clear neighborhood selection
                const neighborhoodSelect = document.getElementById('neighborhood-select');
                if (neighborhoodSelect) {
                    neighborhoodSelect.value = '';
                }
            }
            
            updateCheckoutTotal();
        }

        function updateDeliveryFee() {
            const neighborhoodSelect = document.getElementById('neighborhood-select');
            updateCheckoutTotal();
        }

        function toggleChangeField() {
            const paymentSelect = document.getElementById('payment-method');
            const changeDiv = document.getElementById('change-field');
            
            if (paymentSelect.value === 'money') {
                changeDiv.classList.remove('hidden');
            } else {
                changeDiv.classList.add('hidden');
            }
            
            // Update total when payment method changes
            updateCheckoutTotal();
        }

        function submitOrder() {
            // Get form data manually
            const orderData = {
                customerName: document.getElementById('customer-name').value.trim(),
                customerPhone: document.getElementById('customer-phone').value.trim(),
                deliveryType: document.getElementById('delivery-type-select').value,
                paymentMethod: document.getElementById('payment-method').value,
                disposables: document.getElementById('disposables').value,
                orderNotes: document.getElementById('order-notes').value.trim()
            };
            
            // Validate required fields
            if (!orderData.customerName) {
                showMessage('Por favor, preencha seu nome!');
                const nameField = document.getElementById('customer-name');
                nameField.focus();
                nameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            
            if (!orderData.customerPhone) {
                showMessage('Por favor, preencha seu WhatsApp!');
                const phoneField = document.getElementById('customer-phone');
                phoneField.focus();
                phoneField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            
            if (!orderData.deliveryType) {
                showMessage('Por favor, selecione o tipo de entrega!');
                const deliveryField = document.getElementById('delivery-type-select');
                deliveryField.focus();
                deliveryField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            
            if (!orderData.paymentMethod) {
                showMessage('Por favor, selecione a forma de pagamento!');
                const paymentField = document.getElementById('payment-method');
                paymentField.focus();
                paymentField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Validate delivery fields
            if (orderData.deliveryType === 'delivery') {
                const neighborhoodSelect = document.getElementById('neighborhood-select');
                if (!neighborhoodSelect.value) {
                    showMessage('Por favor, selecione seu bairro para entrega!');
                    neighborhoodSelect.focus();
                    neighborhoodSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
                orderData.neighborhood = neighborhoodSelect.value;
                
                orderData.addressStreet = document.getElementById('address-street').value.trim();
                orderData.addressNumber = document.getElementById('address-number').value.trim();
                orderData.addressComplement = document.getElementById('address-complement').value.trim();
                orderData.addressReference = document.getElementById('address-reference').value.trim();
                
                if (!orderData.addressStreet) {
                    showMessage('Por favor, preencha o nome da rua!');
                    const streetField = document.getElementById('address-street');
                    streetField.focus();
                    streetField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
                
                if (!orderData.addressNumber) {
                    showMessage('Por favor, preencha o número do endereço!');
                    const numberField = document.getElementById('address-number');
                    numberField.focus();
                    numberField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
            }
            
            // Get change amount if payment is money
            if (orderData.paymentMethod === 'money') {
                orderData.changeAmount = document.getElementById('change-amount').value;
            }
            
            // Calculate total for confirmation modal
            let deliveryFee = 0;
            if (orderData.deliveryType === 'delivery' && orderData.neighborhood) {
                const neighborhoodData = orderData.neighborhood.split('-');
                deliveryFee = parseFloat(neighborhoodData[1]);
            }
            
            // Store order data temporarily
            window.pendingOrderData = orderData;
            
            // Close checkout form
            closeCheckoutForm();
            
            // Check payment method and show appropriate modal
            if (orderData.paymentMethod === 'pix') {
                const pixDiscount = total * 0.02;
                const finalTotal = total + deliveryFee - pixDiscount;
                
                // Show PIX modal FIRST - order will be processed after payment confirmation
                showPixPaymentModal(finalTotal, null, orderData);
                return;
            } else {
                // For other payment methods (money/card), show confirmation modal
                const finalTotal = total + deliveryFee;
                showPaymentConfirmationModal(finalTotal, orderData);
                return;
            }
        }

        // Order numbering system
        function getNextOrderNumber() {
            const today = new Date().toDateString(); // Gets date like "Mon Jan 01 2024"
            
            // Get stored data for today
            let todayData = localStorage.getItem(`orders_${today}`);
            
            if (!todayData) {
                // First order of the day
                todayData = { count: 1, date: today };
                localStorage.setItem(`orders_${today}`, JSON.stringify(todayData));
                return '001';
            } else {
                // Increment counter
                const data = JSON.parse(todayData);
                data.count += 1;
                localStorage.setItem(`orders_${today}`, JSON.stringify(data));
                
                // Format number with leading zeros
                return data.count.toString().padStart(3, '0');
            }
        }

        // Customer data management
        function saveCustomerData(orderData) {
            const customerData = {
                name: orderData.customerName,
                phone: orderData.customerPhone,
                lastDeliveryType: orderData.deliveryType,
                lastNeighborhood: orderData.neighborhood || '',
                lastAddress: {
                    street: orderData.addressStreet || '',
                    number: orderData.addressNumber || '',
                    complement: orderData.addressComplement || '',
                    neighborhood: orderData.addressNeighborhood || '',
                    reference: orderData.addressReference || ''
                },
                lastPaymentMethod: orderData.paymentMethod,
                lastDisposables: orderData.disposables
            };
            
            localStorage.setItem(`customer_${orderData.customerPhone}`, JSON.stringify(customerData));
        }

        function lookupCustomer() {
            const phoneInput = document.getElementById('customer-phone');
            const phone = phoneInput.value.trim();
            
            if (!phone) return;
            
            const customerData = localStorage.getItem(`customer_${phone}`);
            
            if (customerData) {
                const data = JSON.parse(customerData);
                
                // Fill customer data
                document.getElementById('customer-name').value = data.name;
                
                // Fill delivery data
                if (data.lastDeliveryType) {
                    const deliverySelect = document.getElementById('delivery-type-select');
                    if (deliverySelect) {
                        deliverySelect.value = data.lastDeliveryType;
                        toggleDeliveryFields();
                        
                        // Fill neighborhood if delivery
                        if (data.lastDeliveryType === 'delivery' && data.lastNeighborhood) {
                            setTimeout(() => {
                                const neighborhoodSelect = document.getElementById('neighborhood-select');
                                if (neighborhoodSelect) {
                                    neighborhoodSelect.value = data.lastNeighborhood;
                                    updateDeliveryFee();
                                }
                            }, 100);
                        }
                    }
                }
                
                // Fill address data
                if (data.lastAddress) {
                    document.getElementById('address-street').value = data.lastAddress.street;
                    document.getElementById('address-number').value = data.lastAddress.number;
                    document.getElementById('address-complement').value = data.lastAddress.complement;
                    document.getElementById('address-neighborhood').value = data.lastAddress.neighborhood;
                    document.getElementById('address-reference').value = data.lastAddress.reference;
                }
                
                // Fill payment method
                if (data.lastPaymentMethod) {
                    const paymentSelect = document.getElementById('payment-method');
                    if (paymentSelect) {
                        paymentSelect.value = data.lastPaymentMethod;
                        toggleChangeField();
                    }
                }
                
                // Fill disposables
                if (data.lastDisposables) {
                    const disposablesSelect = document.getElementById('disposables');
                    if (disposablesSelect) {
                        disposablesSelect.value = data.lastDisposables;
                    }
                }
                
                // Show success message
                document.getElementById('customer-found').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('customer-found').classList.add('hidden');
                }, 5000);
            }
        }

        function sendWhatsAppWithData(orderData) {
            // Get order number
            const orderNumber = getNextOrderNumber();
            
            let message = `🥄 *O PURO AÇAÍ - PEDIDO #${orderNumber}*\n\n`;
            
            // Customer info
            message += `👤 *CLIENTE*\n`;
            message += `Nome: ${orderData.customerName}\n`;
            message += `WhatsApp: ${orderData.customerPhone}\n\n`;
            
            // Calculate delivery fee first
            let deliveryFee = 0;
            if (orderData.deliveryType === 'delivery' && orderData.neighborhood) {
                const neighborhoodData = orderData.neighborhood.split('-');
                deliveryFee = parseFloat(neighborhoodData[1]);
            }
            
            // Delivery info
            message += `🚚 *ENTREGA*\n`;
            if (orderData.deliveryType === 'delivery') {
                const neighborhoodData = orderData.neighborhood.split('-');
                const neighborhoodName = neighborhoodData[0];
                
                message += `Tipo: Delivery\n`;
                message += `Bairro: ${neighborhoodName}`;
                if (deliveryFee > 0) {
                    message += ` (+R$ ${deliveryFee.toFixed(2).replace('.', ',')})\n`;
                } else {
                    message += ` (Grátis)\n`;
                }
                message += `Endereço: ${orderData.addressStreet}, ${orderData.addressNumber}`;
                if (orderData.addressComplement) {
                    message += ` - ${orderData.addressComplement}`;
                }
                message += `\n`;
                if (orderData.addressReference) {
                    message += `Referência: ${orderData.addressReference}\n`;
                }
            } else {
                message += `Tipo: Retirada no Local\n`;
            }
            message += '\n';
            
            // Payment info
            message += `💳 *PAGAMENTO*\n`;
            const paymentMethods = {
                'money': 'Dinheiro',
                'pix': 'PIX (com desconto)',
                'card': 'Cartão (Débito/Crédito)'
            };
            message += `Forma: ${paymentMethods[orderData.paymentMethod]}\n`;
            
            // Calculate PIX discount and final total for WhatsApp
            let pixDiscount = 0;
            if (orderData.paymentMethod === 'pix') {
                pixDiscount = total * 0.02;
            }
            
            const finalTotal = total + deliveryFee - pixDiscount;
            
            if (orderData.paymentMethod === 'money' && orderData.changeAmount) {
                const changeFor = parseFloat(orderData.changeAmount);
                const changeToGive = changeFor - finalTotal;
                message += `Troco para: R$ ${changeFor.toFixed(2).replace('.', ',')}\n`;
                message += `💰 *TROCO A DAR: R$ ${changeToGive.toFixed(2).replace('.', ',')}*\n`;
            }
            message += '\n';
            
            // Order items
            message += `🛒 *PEDIDO*\n\n`;
            
            cartItems.forEach((cartItem, index) => {
                message += `*${cartItem.category}*\n`;
                
                // Group items by type
                const items = {
                    base: [],
                    montagem: [],
                    frutas: [],
                    complementos: [],
                    adicionais: [],
                    coberturas: []
                };
                
                cartItem.selections.forEach(selection => {
                    if (selection.type.includes('base')) {
                        items.base.push(selection);
                    } else if (selection.type === 'montagem') {
                        items.montagem.push(selection);
                    } else if (selection.type.includes('frutas')) {
                        items.frutas.push(selection);
                    } else if (selection.type.includes('complementos')) {
                        items.complementos.push(selection);
                    } else if (selection.type.includes('adicionais')) {
                        items.adicionais.push(selection);
                    } else if (selection.type.includes('coberturas')) {
                        items.coberturas.push(selection);
                    }
                });
                
                // Build message for this item
                if (items.base.length > 0) {
                    items.base.forEach(item => {
                        message += `• ${item.text} - R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
                    });
                }
                
                if (items.montagem.length > 0) {
                    items.montagem.forEach(item => {
                        message += `🥄 ${item.text}\n`;
                    });
                }
                
                if (items.frutas.length > 0) {
                    message += `Frutas: `;
                    items.frutas.forEach((item, i) => {
                        message += item.text;
                        if (i < items.frutas.length - 1) message += ', ';
                    });
                    message += '\n';
                }
                
                if (items.complementos.length > 0) {
                    message += `Complementos: `;
                    items.complementos.forEach((item, i) => {
                        message += `${item.text} (+R$ ${item.price.toFixed(2).replace('.', ',')})`;
                        if (i < items.complementos.length - 1) message += ', ';
                    });
                    message += '\n';
                }
                
                if (items.adicionais.length > 0) {
                    message += `Adicionais: `;
                    items.adicionais.forEach((item, i) => {
                        message += `${item.text} (+R$ ${item.price.toFixed(2).replace('.', ',')})`;
                        if (i < items.adicionais.length - 1) message += ', ';
                    });
                    message += '\n';
                }
                
                if (items.coberturas.length > 0) {
                    message += `Coberturas: `;
                    items.coberturas.forEach((item, i) => {
                        message += `${item.text} (+R$ ${item.price.toFixed(2).replace('.', ',')})`;
                        if (i < items.coberturas.length - 1) message += ', ';
                    });
                    message += '\n';
                }
                
                message += `*Subtotal: R$ ${cartItem.total.toFixed(2).replace('.', ',')}*\n\n`;
            });
            
            // Totals
            message += `*Subtotal Produtos: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
            
            if (orderData.deliveryType === 'delivery') {
                if (deliveryFee > 0) {
                    message += `*Taxa de Entrega: R$ ${deliveryFee.toFixed(2).replace('.', ',')}*\n`;
                } else {
                    message += `*Taxa de Entrega: Grátis*\n`;
                }
            }
            
            if (pixDiscount > 0) {
                message += `*Desconto PIX: -R$ ${pixDiscount.toFixed(2).replace('.', ',')}*\n`;
            }
            
            message += `*TOTAL GERAL: R$ ${finalTotal.toFixed(2).replace('.', ',')}*\n\n`;
            
            // Disposables
            message += `🥄 *DESCARTÁVEIS*\n`;
            message += orderData.disposables === 'yes' ? 'Sim, preciso de descartáveis\n\n' : 'Não preciso\n\n';
            
            // Notes
            if (orderData.orderNotes) {
                message += `📝 *OBSERVAÇÕES*\n${orderData.orderNotes}\n\n`;
            }
            
            message += `⏰ Pedido realizado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
            
            // Add tracking link
            const trackingUrl = `${window.location.origin}${window.location.pathname.replace('index_test.html', '')}acompanhamento.html?pedido=${orderNumber}`;
            message += `📱 *ACOMPANHE SEU PEDIDO:*\n${trackingUrl}`;
            
            const whatsappUrl = `https://wa.me/5513991945381?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // IMPORTANT: Save order to system BEFORE showing success
            orderData.orderNumber = orderNumber; // Add order number to data
            const savedOrder = saveOrderToSystem(orderData, total, cartItems);
            
            // Save customer data for future orders
            saveCustomerData(orderData);
            
            // Clear cart and close forms
            cartItems = [];
            updateCartDisplay();
            closeCheckoutForm();
            
            // Show success modal with order number
            showSuccessModal(orderNumber);
        }
        
        // Export sendWhatsAppWithData to global scope for external access
        window.sendWhatsAppWithData = sendWhatsAppWithData;

        function addReadyOptionToCart(name, description, price) {
            // Create cart item for ready option
            const cartItem = {
                category: `${name} - 500ml`,
                selections: [],
                total: price
            };
            
            // Add base item
            cartItem.selections.push({
                type: 'ready-option-base',
                text: '500ml',
                price: price
            });
            
            // Add ingredients as included items
            const ingredients = description.split(' + ');
            ingredients.forEach(ingredient => {
                cartItem.selections.push({
                    type: 'ingredientes-inclusos',
                    text: ingredient,
                    price: 0
                });
            });
            
            // Add to cart
            cartItems.push(cartItem);
            
            updateCartDisplay();
            
            showMessage(`${name} adicionado à sacola! 🎉`);
        }

        function showMessage(text) {
            // Create toast message
            const toast = document.createElement('div');
            toast.className = 'fixed top-24 left-4 right-4 bg-secondary text-primary p-4 rounded-lg z-50 text-center font-medium shadow-lg';
            toast.textContent = text;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 1000);
        }



        // Menu functionality
        function scrollToSection(sectionId) {
            const section = document.getElementById(`section-${sectionId}`);
            if (section) {
                // Scroll to show the title with some padding from the top menu
                const topMenuHeight = document.getElementById('top-menu').offsetHeight;
                const headerHeight = document.querySelector('header').offsetHeight;
                const totalOffset = topMenuHeight + headerHeight + 20; // 20px extra padding
                
                const sectionTop = section.offsetTop - totalOffset;
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
            }
        }

        // Combo data and functions
        const comboData = {
            'doce-encontro': {
                name: 'Combo Doce Encontro',
                emoji: '💜🍓',
                description: 'O equilíbrio perfeito entre o cremoso caseiro e o toque de Nutella.',
                items: ['Tradicional 500ml', 'Especial 500ml'],
                price: 48.00
            },
            'sabor-verao': {
                name: 'Combo Sabor de Verão',
                emoji: '🌴🎈',
                description: 'Refrescante, colorido e alegre — puro clima de férias.',
                items: ['Tropical 500ml', 'Kids 500ml'],
                price: 50.00
            },
            'realeza': {
                name: 'Combo Realeza',
                emoji: '👑🍫',
                description: 'Fartura e sabor artesanal em uma combinação de respeito.',
                items: ['Premium 500ml', 'Tradicional 500ml'],
                price: 58.00
            },
            'energia-boa': {
                name: 'Combo Energia Boa',
                emoji: '⚡🥛',
                description: 'Cremoso, leve e geladinho — perfeito pra começar o dia ou recarregar as baterias.',
                items: ['Batido 500ml', 'Tropical 500ml'],
                price: 45.00
            },
            'tres-sabores': {
                name: 'Combo Três Sabores',
                emoji: '👨‍👩‍👧',
                description: 'Uma combinação pra todos os gostos — doce, leve e divertida.',
                items: ['Tradicional 500ml', 'Especial 500ml', 'Kids 500ml'],
                price: 74.00
            },
            'topzera': {
                name: 'Combo Topzera',
                emoji: '🍇🍓',
                description: 'Os campeões de venda juntos — o trio mais pedido do cardápio.',
                items: ['Premium 500ml', 'Especial 500ml', 'Tropical 500ml'],
                price: 88.00
            },
            'leveza': {
                name: 'Combo Leveza',
                emoji: '🍌🥥',
                description: 'Doce na medida certa, com aquele sabor que não enjoa nunca.',
                items: ['Batido 500ml', 'Tradicional 500ml'],
                price: 42.00
            },

            'alegria': {
                name: 'Combo Alegria',
                emoji: '💫',
                description: 'Diversão e indulgência em uma dupla que não tem erro.',
                items: ['Premium 500ml', 'Kids 500ml'],
                price: 60.00
            },
            'rei-sabor': {
                name: 'Combo Rei do Sabor',
                emoji: '👑',
                description: 'Dupla intensa, encorpada e cheia de sabor.',
                items: ['Premium 500ml', 'Tropical 500ml'],
                price: 65.00
            },
            'classico': {
                name: 'Combo Clássico',
                emoji: '🍌',
                description: 'Simples, cremoso e sempre irresistível.',
                items: ['Tradicional 500ml', 'Tradicional 500ml'],
                price: 46.00
            },
            'gourmet': {
                name: 'Combo Gourmet',
                emoji: '🍓',
                description: 'Frutas, Nutella e muito sabor — o queridinho do cardápio.',
                items: ['Especial 500ml', 'Especial 500ml'],
                price: 56.00
            }
        };

        function openComboModal(comboType) {
            const combo = comboData[comboType];
            if (!combo) return;
            
            // Update modal content
            document.getElementById('highlight-modal-title').textContent = combo.name;
            document.getElementById('highlight-modal-subtitle').textContent = `${combo.items.length} itens - R$ ${combo.price.toFixed(2).replace('.', ',')}`;
            
            // Populate modal body
            const modalBody = document.getElementById('highlight-modal-body');
            modalBody.innerHTML = `
                <!-- Description -->
                <div class="text-center">
                    <div class="text-4xl mb-4">${combo.emoji}</div>
                    <p class="text-gray-700 leading-relaxed mb-6">${combo.description}</p>
                </div>
                
                <!-- Items Included -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-primary mb-4">🍽️ ITENS INCLUSOS:</h3>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="space-y-3">
                            ${combo.items.map((item, index) => `
                                <div class="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                    <div class="flex items-center">
                                        <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                            ${index + 1}
                                        </div>
                                        <span class="font-medium">${item}</span>
                                    </div>
                                    <span class="text-green-600 font-bold text-sm">✓</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Container Selection -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-primary mb-3">🥄 RECIPIENTE <span class="text-red-500">*</span></h3>
                    <select name="combo-container" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="toggleComboMontagem(); updateComboPrice()">
                        <option value="">Escolha o recipiente para todos os itens...</option>
                        <option value="tigela">🥄 Tigela (todos os itens)</option>
                        <option value="copo">🥤 Copo (todos os itens)</option>
                    </select>
                </div>

                <!-- Montagem (only for tigela) -->
                <div id="combo-montagem" class="mb-6 hidden">
                    <h3 class="text-lg font-bold text-primary mb-3">🥄 COMO VOCÊ QUER SEUS AÇAÍS? <span class="text-red-500">*</span></h3>
                    <select name="combo-montagem-select" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" onchange="updateComboPrice()">
                        <option value="">Selecione como quer seus açaís...</option>
                        <option value="montado">Montado - Açaís já misturados (todos)</option>
                        <option value="separado">Separado - Açaís e complementos separados (todos)</option>
                    </select>
                </div>

                <!-- Savings Info -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center text-green-700">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <div>
                            <div class="font-bold">Combo com Desconto!</div>
                            <div class="text-sm">Todos os itens já vêm com seus ingredientes inclusos.</div>
                        </div>
                    </div>
                </div>
            `;
            
            // Store current combo for later use
            currentHighlight = combo;
            currentHighlight.type = 'combo';
            
            // Reset add button
            document.getElementById('highlight-add-text').textContent = 'Selecione as opções';
            
            // Show modal with animation
            const modal = document.getElementById('highlight-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('highlight-modal-content').classList.remove('translate-y-full');
                // Reset scroll position to top after modal is visible
                const modalBody = document.getElementById('highlight-modal-body');
                modalBody.scrollTop = 0;
            }, 10);
        }

        function toggleComboMontagem() {
            const containerSelect = document.querySelector('select[name="combo-container"]');
            const montagemDiv = document.getElementById('combo-montagem');
            const montagemSelect = document.querySelector('select[name="combo-montagem-select"]');
            
            if (containerSelect && containerSelect.value === 'tigela') {
                montagemDiv.classList.remove('hidden');
                montagemSelect.required = true;
            } else {
                montagemDiv.classList.add('hidden');
                montagemSelect.required = false;
                montagemSelect.value = '';
            }
        }

        function updateComboPrice() {
            if (!currentHighlight || currentHighlight.type !== 'combo') return;
            
            const containerSelect = document.querySelector('select[name="combo-container"]');
            const montagemSelect = document.querySelector('select[name="combo-montagem-select"]');
            
            // Check if all required fields are selected
            let allFieldsFilled = containerSelect && containerSelect.value;
            
            // If tigela is selected, also check montagem
            if (containerSelect && containerSelect.value === 'tigela') {
                allFieldsFilled = allFieldsFilled && montagemSelect && montagemSelect.value;
            }
            
            // Update price if all required fields are selected
            if (allFieldsFilled) {
                const price = currentHighlight.price;
                document.getElementById('highlight-add-text').textContent = `Adicionar - R$ ${price.toFixed(2).replace('.', ',')}`;
            } else {
                document.getElementById('highlight-add-text').textContent = 'Selecione as opções';
            }
        }

        // Initialize
        updateCartDisplay();
        initPromoSystem();
        
        // Export variables and functions to global scope for external access
        window.cartItems = cartItems;
        window.total = total;
        window.getNextOrderNumber = getNextOrderNumber;
        window.saveCustomerData = saveCustomerData;

// ============================================
// SISTEMA DE GERENCIAMENTO DE PEDIDOS
// ============================================

// Save order to localStorage
function saveOrderToSystem(orderData, cartTotal, cartItemsList) {
    // Use passed values or try to get from window scope
    const orderTotal = cartTotal || window.total || 0;
    const orderItems = cartItemsList || window.cartItems || [];
    
    // Generate unique ID
    const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Get existing orders
    const existingOrders = localStorage.getItem('acai_orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    
    // Calculate delivery fee
    let deliveryFee = 0;
    if (orderData.deliveryType === 'delivery' && orderData.neighborhood) {
        const neighborhoodData = orderData.neighborhood.split('-');
        deliveryFee = parseFloat(neighborhoodData[1]) || 0;
    }
    
    // Calculate PIX discount
    let pixDiscount = 0;
    if (orderData.paymentMethod === 'pix') {
        pixDiscount = orderTotal * 0.02;
    }
    
    const finalTotal = orderTotal + deliveryFee - pixDiscount;
    
    // Format items for storage
    const formattedItems = orderItems.map(cartItem => {
        let description = '';
        
        // Group selections by type
        const frutas = cartItem.selections ? cartItem.selections.filter(s => s.type.includes('frutas')).map(s => s.text) : [];
        const complementos = cartItem.selections ? cartItem.selections.filter(s => s.type.includes('complementos')).map(s => s.text) : [];
        const coberturas = cartItem.selections ? cartItem.selections.filter(s => s.type.includes('coberturas')).map(s => s.text) : [];
        const adicionais = cartItem.selections ? cartItem.selections.filter(s => s.type.includes('adicionais')).map(s => s.text) : [];
        
        if (frutas.length > 0) description += `Frutas: ${frutas.join(', ')}. `;
        if (complementos.length > 0) description += `Complementos: ${complementos.join(', ')}. `;
        if (coberturas.length > 0) description += `Coberturas: ${coberturas.join(', ')}. `;
        if (adicionais.length > 0) description += `Adicionais: ${adicionais.join(', ')}. `;
        
        return {
            category: cartItem.category,
            description: description || 'Conforme pedido',
            total: cartItem.total
        };
    });
    
    // Create order object
    const order = {
        id: orderId,
        orderNumber: orderData.orderNumber || getNextOrderNumber(),
        date: new Date().toISOString(),
        status: 'pending',
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        deliveryType: orderData.deliveryType,
        neighborhood: orderData.deliveryType === 'delivery' ? orderData.neighborhood.split('-')[0] : '',
        addressStreet: orderData.addressStreet || '',
        addressNumber: orderData.addressNumber || '',
        addressComplement: orderData.addressComplement || '',
        addressReference: orderData.addressReference || '',
        deliveryFee: deliveryFee,
        paymentMethod: orderData.paymentMethod,
        changeAmount: orderData.changeAmount || 0,
        pixDiscount: pixDiscount,
        orderNotes: orderData.orderNotes || '',
        disposables: orderData.disposables,
        items: formattedItems,
        subtotal: orderTotal,
        total: finalTotal
    };
    
    // Add to orders array
    orders.push(order);
    
    // Save to localStorage
    localStorage.setItem('acai_orders', JSON.stringify(orders));
    
    return order;
}

// Global function for order numbering (accessible from saveOrderToSystem)
function getNextOrderNumber() {
    const today = new Date().toDateString();
    let todayData = localStorage.getItem(`orders_${today}`);
    
    if (!todayData) {
        todayData = { count: 1, date: today };
        localStorage.setItem(`orders_${today}`, JSON.stringify(todayData));
        return '001';
    } else {
        const data = JSON.parse(todayData);
        data.count += 1;
        localStorage.setItem(`orders_${today}`, JSON.stringify(data));
        return data.count.toString().padStart(3, '0');
    }
}

// submitOrder function is defined earlier in the code (line ~2640)
// This duplicate definition has been removed to prevent conflicts

// Show payment confirmation modal (for money/card)
function showPaymentConfirmationModal(orderTotal, orderData) {
    // Store order data globally
    window.pendingOrderData = orderData;
    window.pendingOrderTotal = orderTotal;
    
    const paymentMethodNames = {
        'money': '💵 Dinheiro',
        'card': '💳 Cartão'
    };
    
    const paymentName = paymentMethodNames[orderData.paymentMethod] || orderData.paymentMethod;
    
    const modal = document.createElement('div');
    modal.id = 'payment-confirmation-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-md w-full my-8 max-h-screen overflow-y-auto">
            <!-- Header -->
            <div class="text-center mb-6">
                <div class="text-6xl mb-3">${orderData.paymentMethod === 'money' ? '💵' : '💳'}</div>
                <h2 class="text-2xl font-bold text-primary mb-1">Confirmar Pedido</h2>
                <p class="text-gray-600">Pagamento: ${paymentName}</p>
            </div>
            
            <!-- Valor -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6 text-center border-2 border-primary/20">
                <div class="text-sm text-gray-600 mb-2 font-medium">Valor total</div>
                <div class="text-5xl font-bold text-primary mb-2">R$ ${orderTotal.toFixed(2).replace('.', ',')}</div>
                ${orderData.paymentMethod === 'money' && orderData.changeAmount ? 
                    `<div class="text-sm text-gray-600 mt-2">Troco para: R$ ${parseFloat(orderData.changeAmount).toFixed(2).replace('.', ',')}</div>` : 
                    ''}
            </div>
            
            <!-- Botão Copiar Pedido -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
                <div class="text-center mb-3">
                    <div class="text-sm font-bold text-gray-700 mb-1">📋 Informações do Pedido</div>
                    <div class="text-xs text-gray-600">Copie e envie para o WhatsApp do estabelecimento</div>
                </div>
                <button onclick="copyOrderDetailsFromConfirmation()" 
                        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                    <div class="flex items-center justify-center gap-2">
                        <span class="text-xl">📋</span>
                        <span>Copiar Detalhes do Pedido</span>
                    </div>
                </button>
                <div class="text-xs text-center text-gray-500 mt-2">
                    Após copiar, cole no WhatsApp: <strong>(13) 99194-5381</strong>
                </div>
            </div>
            
            <!-- Instruções -->
            <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 mb-6">
                <h4 class="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    <span class="text-xl">${orderData.paymentMethod === 'money' ? '💵' : '💳'}</span>
                    <span>Instruções:</span>
                </h4>
                <ol class="text-sm text-yellow-800 space-y-2">
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">1.</span>
                        <span>Copie os detalhes do pedido acima</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">2.</span>
                        <span>Envie para o WhatsApp: <strong>(13) 99194-5381</strong></span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">3.</span>
                        <span>${orderData.paymentMethod === 'money' ? 
                            'Prepare o dinheiro (com troco se necessário)' : 
                            'Tenha seu cartão em mãos'}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">4.</span>
                        <span>Clique em "Confirmar Pedido" abaixo</span>
                    </li>
                </ol>
            </div>
            
            <!-- Botões -->
            <div class="flex gap-3">
                <button onclick="confirmPaymentAndProcess()" 
                        class="flex-1 bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                    ✅ Confirmar Pedido
                </button>
                <button onclick="closePaymentConfirmationModal()" 
                        class="px-6 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transition-all">
                    Cancelar
                </button>
            </div>
            
            <!-- Aviso -->
            <div class="mt-4 text-center">
                <p class="text-xs text-gray-500">⏰ Após enviar as informações, clique em "Confirmar Pedido"</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Copy order details from confirmation modal
function copyOrderDetailsFromConfirmation() {
    // Get order data from either PIX or regular flow
    const orderData = window.pendingOrderData || window.pendingPixOrderData;
    const orderTotal = window.pendingOrderTotal || window.pendingPixTotal || 0;
    
    if (!orderData) {
        alert('Erro: Dados do pedido não encontrados');
        return;
    }
    
    // Montar mensagem formatada
    let message = `🥄 *PEDIDO - O PURO AÇAÍ*\n\n`;
    
    // Cliente
    message += `👤 *CLIENTE*\n`;
    message += `Nome: ${orderData.customerName}\n`;
    message += `WhatsApp: ${orderData.customerPhone}\n\n`;
    
    // Entrega
    message += `🚚 *ENTREGA*\n`;
    if (orderData.deliveryType === 'delivery') {
        message += `Tipo: Delivery\n`;
        if (orderData.neighborhood) {
            const neighborhoodData = orderData.neighborhood.split('-');
            const neighborhoodName = neighborhoodData[0];
            const deliveryFee = parseFloat(neighborhoodData[1] || 0);
            message += `Bairro: ${neighborhoodName}`;
            if (deliveryFee > 0) {
                message += ` (+R$ ${deliveryFee.toFixed(2).replace('.', ',')})\n`;
            } else {
                message += ` (Grátis)\n`;
            }
        }
        if (orderData.addressStreet && orderData.addressNumber) {
            message += `Endereço: ${orderData.addressStreet}, ${orderData.addressNumber}`;
            if (orderData.addressComplement) {
                message += ` - ${orderData.addressComplement}`;
            }
            message += `\n`;
        }
        if (orderData.addressReference) {
            message += `Referência: ${orderData.addressReference}\n`;
        }
    } else {
        message += `Tipo: Retirada no Local\n`;
    }
    message += '\n';
    
    // Pagamento
    const paymentNames = {
        'pix': 'PIX (com desconto de 2%)',
        'money': 'Dinheiro',
        'card': 'Cartão (Débito/Crédito)'
    };
    message += `💳 *PAGAMENTO*\n`;
    message += `Forma: ${paymentNames[orderData.paymentMethod] || orderData.paymentMethod}\n`;
    message += `Valor: R$ ${orderTotal.toFixed(2).replace('.', ',')}\n`;
    if (orderData.paymentMethod === 'money' && orderData.changeAmount) {
        message += `Troco para: R$ ${parseFloat(orderData.changeAmount).toFixed(2).replace('.', ',')}\n`;
    }
    message += '\n';
    
    // Itens do pedido
    if (typeof cartItems !== 'undefined' && cartItems.length > 0) {
        message += `🛒 *ITENS DO PEDIDO*\n\n`;
        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.category}\n`;
            if (item.selections && item.selections.length > 0) {
                item.selections.forEach(sel => {
                    if (sel.text) {
                        message += `   • ${sel.text}\n`;
                    }
                });
            }
            message += `   Subtotal: R$ ${item.total.toFixed(2).replace('.', ',')}\n\n`;
        });
    }
    
    // Descartáveis
    if (orderData.disposables) {
        message += `🥄 *DESCARTÁVEIS*\n`;
        message += orderData.disposables === 'yes' ? 'Sim, preciso de descartáveis\n\n' : 'Não preciso\n\n';
    }
    
    // Observações
    if (orderData.orderNotes) {
        message += `📝 *OBSERVAÇÕES*\n${orderData.orderNotes}\n\n`;
    }
    
    // Total
    message += `💰 *TOTAL A PAGAR*\n`;
    message += `R$ ${orderTotal.toFixed(2).replace('.', ',')}\n\n`;
    
    // Data e hora
    message += `⏰ ${new Date().toLocaleString('pt-BR')}`;
    
    // Copiar para clipboard
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = message;
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-9999px';
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    
    // Feedback visual
    const btn = event.target.closest('button');
    if (btn) {
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <span class="text-xl">✅</span>
                <span>Pedido Copiado!</span>
            </div>
        `;
        btn.className = 'w-full bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.className = 'w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105';
        }, 2000);
    }
}

// Confirm payment and process order
function confirmPaymentAndProcess() {
    closePaymentConfirmationModal();
    
    if (window.pendingOrderData) {
        const orderData = window.pendingOrderData;
        
        // Process the order NOW
        if (typeof window.sendWhatsAppWithData === 'function') {
            window.sendWhatsAppWithData(orderData);
        }
        
        // Clean up
        delete window.pendingOrderData;
        delete window.pendingOrderTotal;
    }
}

// Close payment confirmation modal
function closePaymentConfirmationModal() {
    const modal = document.getElementById('payment-confirmation-modal');
    if (modal) modal.remove();
}

// Show success modal
function showSuccessModal(orderNumber) {
    const trackingUrl = `${window.location.origin}${window.location.pathname.replace('index_test.html', '')}acompanhamento.html?pedido=${orderNumber}`;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div class="text-6xl mb-4">✅</div>
            <h2 class="text-2xl font-bold text-primary mb-2">Pedido Realizado!</h2>
            <p class="text-gray-600 mb-4">Seu pedido foi registrado com sucesso</p>
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="text-sm text-gray-600 mb-1">Número do Pedido</div>
                <div class="text-3xl font-bold text-primary">#${orderNumber}</div>
            </div>
            <a href="${trackingUrl}" target="_blank" 
               class="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl mb-4 transform hover:scale-105">
                <div class="flex items-center justify-center gap-2">
                    <span class="text-2xl">📱</span>
                    <span>Acompanhar Pedido</span>
                </div>
            </a>
            <p class="text-sm text-gray-600 mb-6">
                Em breve entraremos em contato!
            </p>
            <button onclick="this.closest('.fixed').remove()" 
                    class="w-full bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                Fechar
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Auto close after 10 seconds
    setTimeout(() => {
        modal.remove();
    }, 10000);
}
