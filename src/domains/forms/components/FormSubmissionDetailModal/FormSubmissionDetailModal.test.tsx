import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLanguageStore } from '@/shared/model/language.store'
import { FormSubmissionDetailModal } from './FormSubmissionDetailModal'
import type { Form, FormSubmission } from '../../model/form.types'

beforeEach(() => {
  useLanguageStore.setState({ language: 'es' })
})

const form: Form = {
  id: 'form-1',
  title: { en: 'Contact' },
  status: 'active',
  notificationEmails: [],
  fields: [
    {
      fieldId: 'f1',
      type: 'text',
      label: { en: 'Full name', es: 'Nombre completo' },
      required: true,
    },
    // No `es` key on purpose: exercises the field.label.en fallback.
    {
      fieldId: 'f2',
      type: 'email',
      label: { en: 'Email address' },
      required: true,
    },
    {
      fieldId: 'f3',
      type: 'textarea',
      label: { en: 'Message', es: 'Mensaje' },
      required: false,
    },
  ],
}

const submission: FormSubmission = {
  id: 'sub-1',
  formId: 'form-1',
  isRead: false,
  data: { f1: 'Jane Doe', f2: 'jane@example.com', f3: 'Hello world' },
}

describe('FormSubmissionDetailModal', () => {
  it('renders one field per form field, in form field order', () => {
    render(
      <FormSubmissionDetailModal
        form={form}
        submission={submission}
        onClose={() => {}}
      />
    )
    // FormSubmissionDetailModal renders via a portal (Modal), so query from
    // document.body rather than the render() container. DetailField's label
    // span carries a distinctive `uppercase` class — use it to read back the
    // rendered labels in document order.
    const labelNodes = document.body.querySelectorAll('span.uppercase')
    const labelTexts = Array.from(labelNodes).map((node) => node.textContent)
    // The first labels belong to the fixed submittedAt/ipAddress/userAgent
    // metadata block; the form-field labels are the trailing ones.
    expect(labelTexts.slice(-3)).toEqual([
      'Nombre completo',
      'Email address',
      'Mensaje',
    ])
  })

  it('resolves each label via field.label[language], falling back to .en when missing', () => {
    render(
      <FormSubmissionDetailModal
        form={form}
        submission={submission}
        onClose={() => {}}
      />
    )
    expect(screen.getByText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByText('Mensaje')).toBeInTheDocument()
    expect(screen.getByText('Email address')).toBeInTheDocument()
  })

  it('never renders raw fieldId strings as labels', () => {
    render(
      <FormSubmissionDetailModal
        form={form}
        submission={submission}
        onClose={() => {}}
      />
    )
    expect(screen.queryByText('f1')).not.toBeInTheDocument()
    expect(screen.queryByText('f2')).not.toBeInTheDocument()
    expect(screen.queryByText('f3')).not.toBeInTheDocument()
  })

  it('shows each field value next to its label', () => {
    render(
      <FormSubmissionDetailModal
        form={form}
        submission={submission}
        onClose={() => {}}
      />
    )
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders nothing when there is no submission selected', () => {
    render(
      <FormSubmissionDetailModal
        form={form}
        submission={null}
        onClose={() => {}}
      />
    )
    expect(screen.queryByText('Nombre completo')).not.toBeInTheDocument()
  })
})
