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
})
