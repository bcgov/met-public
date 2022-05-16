import { LoadingButton } from "@mui/lab";
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, FormHelperText, InputLabel, Paper, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { literal, object, string, TypeOf } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = object({
    name: string()
      .nonempty('Name is required')
      .max(100, 'Name must be less than 100 characters'),
    description: string()
      .nonempty('Description is required'),
    password: string()
      .nonempty('Password is required')
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string().nonempty('Please confirm your password'),
    terms: literal(true, {
      invalid_type_error: 'Accept Terms is required',
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  });

type RegisterInput = TypeOf<typeof registerSchema>;

const EngagementFormComponent = () => {
    const [loading, setLoading] = useState(false);

    const {
      register,
      formState: { errors, isSubmitSuccessful },
      reset,
      handleSubmit,
    } = useForm<RegisterInput>({
      resolver: zodResolver(registerSchema),
    });
  
    useEffect(() => {
      if (isSubmitSuccessful) {
        reset();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);
  
    const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
      console.log(values);
    };

    return (
        <Box>
            <Typography variant='h5' component='h1' sx={{ pt: '2rem' }}>
                Engagement Details
            </Typography>
            <Box
                component='form'
                noValidate
                autoComplete='off'
                border='1px solid'
                sx={{ p: '20px' }}
                onSubmit={handleSubmit(onSubmitHandler)}
            >
                <TextField
                    id="engagementName"
                    label="Engagement Name"
                    sx={{ mt: 2 }}
                    fullWidth
                    required
                    error={!!errors['name']}
                    helperText={errors['name'] ? errors['name'].message : ''}
                    {...register('name')}
                />
                <TextField
                    sx={{ mb: 2 }}
                    label='Engagement Description'
                    fullWidth
                    required
                    multiline
                    rows={5}
                    error={!!errors['description']}
                    helperText={errors['description'] ? errors['description'].message : ''}
                    {...register('description')}
                />
                <div>
                    <TextField
                    sx={{ mb: 2 }}
                    label='Password'
                    required
                    type='password'
                    error={!!errors['password']}
                    helperText={errors['password'] ? errors['password'].message : ''}
                    {...register('password')}
                    />
                    <TextField
                    sx={{ mb: 2 }}
                    label='Confirm Password'
                    required
                    type='password'
                    error={!!errors['passwordConfirm']}
                    helperText={
                        errors['passwordConfirm'] ? errors['passwordConfirm'].message : ''
                    }
                    {...register('passwordConfirm')}
                    />
                </div>


                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox required />}
                        {...register('terms')}
                        label={
                        <Typography color={errors['terms'] ? 'error' : 'inherit'}>
                            Accept Terms and Conditions
                        </Typography>
                        }
                    />
                    <FormHelperText error={!!errors['terms']}>
                        {errors['terms'] ? errors['terms'].message : ''}
                    </FormHelperText>
                </FormGroup>

                <LoadingButton
                    variant='contained'
                    fullWidth
                    type='submit'
                    loading={loading}
                    sx={{ py: '0.8rem', mt: '1rem' }}
                    >
                    Register
                </LoadingButton>
            </Box>
        </Box>
    );
}

export default EngagementFormComponent;