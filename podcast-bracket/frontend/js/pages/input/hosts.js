export class HostManager {
    constructor() {
        this.hostsList = document.getElementById('hostsList');
        this.addHostBtn = document.getElementById('addHostBtn');
        this.initialize();
    }

    initialize() {
        if (this.addHostBtn) {
            this.addHostBtn.addEventListener('click', () => this.addHost());
        }
        if (this.hostsList) {
            this.hostsList.addEventListener('click', (e) => this.handleHostRemoval(e));
        }
    }

    addHost() {
        const hostInput = document.createElement('div');
        hostInput.className = 'host-input flex gap-2';
        hostInput.innerHTML = `
            <input type="text" name="hosts[]" required placeholder="Enter host name"
                   class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <button type="button" class="remove-host text-red-600 hover:text-red-700 px-2">
                ×
            </button>
        `;
        this.hostsList.appendChild(hostInput);
        this.notifyHostsChanged();
    }

    handleHostRemoval(event) {
        if (event.target.classList.contains('remove-host')) {
            const hostInput = event.target.closest('.host-input');
            if (this.hostsList.children.length > 1) {
                hostInput.remove();
                this.notifyHostsChanged();
            }
        }
    }

    getHosts() {
        return Array.from(this.hostsList.querySelectorAll('input[name="hosts[]"]'))
            .map(input => input.value)
            .filter(value => value.trim() !== '');
    }

    notifyHostsChanged() {
        // Dispatch a custom event when hosts change
        const event = new CustomEvent('hostsChanged', {
            detail: { hosts: this.getHosts() }
        });
        document.dispatchEvent(event);
    }

    reset() {
        // Keep the first host input and clear its value
        const firstHost = this.hostsList.querySelector('.host-input');
        if (firstHost) {
            firstHost.querySelector('input').value = '';
            // Remove all other host inputs
            Array.from(this.hostsList.children)
                .slice(1)
                .forEach(child => child.remove());
        }
        this.notifyHostsChanged();
    }
}