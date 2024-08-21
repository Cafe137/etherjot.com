import { Optional } from 'cafe-utility'
import Swal from 'sweetalert2'
import { Credentials } from '../type/Credentials'

export type LoginFormResult = {
    username: string
    password: string
}

export async function swalLogin(): Promise<Optional<Credentials>> {
    let usernameInput: HTMLInputElement
    let passwordInput: HTMLInputElement

    const result = await Swal.fire<LoginFormResult>({
        title: 'FDS Login',
        html: `
    <input type="text" id="username" class="swal2-input" placeholder="Username">
    <input type="password" id="password" class="swal2-input" placeholder="Password">
    <p><a href="https://create.fairdatasociety.org/" target="_blank">I don't have an FDS account</a></p>
  `,
        confirmButtonText: 'Sign in',
        focusConfirm: false,
        didOpen: () => {
            const popup = Swal.getPopup()!
            usernameInput = popup.querySelector('#username') as HTMLInputElement
            passwordInput = popup.querySelector('#password') as HTMLInputElement
            usernameInput.onkeyup = event => event.key === 'Enter' && Swal.clickConfirm()
            passwordInput.onkeyup = event => event.key === 'Enter' && Swal.clickConfirm()
        },
        preConfirm: () => {
            const username = usernameInput.value
            const password = passwordInput.value
            if (!username || !password) {
                Swal.showValidationMessage(`Please enter username and password`)
            }
            return { username, password }
        }
    })
    if (!result.value) {
        return Optional.empty()
    }
    return Optional.of({
        username: result.value.username,
        password: result.value.password
    })
}
