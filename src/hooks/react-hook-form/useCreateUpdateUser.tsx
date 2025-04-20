import { yupResolver } from '@hookform/resolvers/yup'
import CreateUpdateUserForm from 'components/user/CreateUpdateUserForm'
import { observer } from 'mobx-react'
import { UserType } from 'models/auth'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateUserFields {
  first_name?: string
  last_name?: string
  email: string
  password: string
  confirm_password: string
  role_id: string
}

export interface UpdateUserFields {
  first_name?: string
  last_name?: string
  email: string
  password?: string
  confirm_password?: string
  role_id: string
}

interface Props {
  defaultValues?: UserType
}

export const useCreateUpdateUserForm = ({ defaultValues }: Props) => {
  const CreateUserSchema = Yup.object().shape({
    first_name: Yup.string().notRequired(),
    last_name: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+='{};!?:".?()\[\]-]{6,}$/,
        'Password must have at least one number, lower or uppercase letter and it has to be longer than 5 characters',
      )
      .required(),
    confrim_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password do not match')
      .required('Password do not match'),
    role_id: Yup.string().required('Role field is required'),
  })
  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string().notRequired(),
    last_name: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string().notRequired(),
    confrim_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password do not match')
      .notRequired(),
    role_id: Yup.string().notRequired(),
  })

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      role_id: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
    resolver: defaultValues
      ? yupResolver(UpdateUserSchema)
      : yupResolver(CreateUserSchema),
  })

  return {
    handleSubmit,
    errors,
    reset,
    control,
  }
}

export default observer(CreateUpdateUserForm)