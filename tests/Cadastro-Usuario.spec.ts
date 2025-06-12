import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {

    test('O usuário irá criar uma conta com sucesso', async ({ page }) => {
        await page.goto('http://localhost:5173/cadastro-usuario')
        await page.fill('input#nome', 'Usuário Teste Playwright')
        await page.fill('input#cpf', '693.187.600-78')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario-auth')

        await page.fill('input#email', 'teste@gmail.com')
        await page.fill('input#senha', '412Teste#')
        await page.fill('input#confirmaSenha', '412Teste#')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/login')
        await expect(page.locator('text=Login')).toBeVisible()
    })

    test('Deve mostrar nome ou CPF não preenchido', async ({ page }) => {
        await page.goto('http://localhost:5173/cadastro-usuario')
        await page.fill('input#nome', '')
        await page.fill('input#cpf', '693.187.600-78')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=Nome ou CPF não preenchido')).toBeVisible()
        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario')
    })

    test('Deve mostrar CPF inválido ou não existe', async ({ page }) => {
        await page.goto('http://localhost:5173/cadastro-usuario')
        await page.fill('input#nome', 'Teste Usuário Playwright')
        await page.fill('input#cpf', '123.456.789-00')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=CPF inválido ou não existe')).toBeVisible()
        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario')
    })

    test('Deve mostrar todos os campos são obrigatórios', async ({ page }) => {
        await page.goto('http://localhost:5173/cadastro-usuario')
        await page.fill('input#nome', 'Usuário Teste Playwright')
        await page.fill('input#cpf', '693.187.600-78')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario-auth')

        await page.fill('input#email', '')
        await page.fill('input#senha', '412Teste#')
        await page.fill('input#confirmaSenha', '412Teste#')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario-auth')
        await expect(page.locator('text=Todos os campos são obrigatórios')).toBeVisible()
    })

    test('Deve mostrar formato de e-mail inválido.', async ({ page }) => {
        await page.goto('http://localhost:5173/cadastro-usuario')
        await page.fill('input#nome', 'Usuário Teste Playwright')
        await page.fill('input#cpf', '693.187.600-78')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario-auth')

        await page.fill('input#email', 'teste@email')
        await page.fill('input#senha', '412Teste#')
        await page.fill('input#confirmaSenha', '412Teste#')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario-auth')
        await expect(page.locator('text=Formato de e-mail inválido')).toBeVisible()
    })

    test('Deve mostrar senha muito fraca', async ({ page }) => {
        await page.goto('http://localhost:5173/cadastro-usuario')
        await page.fill('input#nome', 'Usuário Teste Playwright')
        await page.fill('input#cpf', '693.187.600-78')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario-auth')

        await page.fill('input#email', 'teste@gmail.com')
        await page.fill('input#senha', '412Teste')
        await page.fill('input#confirmaSenha', '412Teste')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario-auth')
        await expect(page.locator('text=Senha muito fraca')).toBeVisible()
    })

    test('Deve mostrar as senhas não coincidem.', async ({ page }) => {
        await page.goto('http://localhost:5173/cadastro-usuario')
        await page.fill('input#nome', 'Usuário Teste Playwright')
        await page.fill('input#cpf', '693.187.600-78')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario-auth')

        await page.fill('input#email', 'teste@gmail.com')
        await page.fill('input#senha', '412Teste##')
        await page.fill('input#confirmaSenha', '412Teste#')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-usuario-auth')
        await expect(page.locator('text=As senhas não coincidem.')).toBeVisible()
    })
})
