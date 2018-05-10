<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card mx-4">
                <div class="card-body p-4">
                    <h1>Register</h1>
                    <p class="text-muted">Create your account</p>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="icon-user"></i></span>
                        </div>
                        <input v-model="username" type="text" class="form-control" placeholder="Username">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">@</span>
                        </div>
                        <input v-model="email" type="text" class="form-control" placeholder="Email">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="icon-lock"></i></span>
                        </div>
                        <op-button data-op-target="2" data-state="locked" style="
            margin-left: 418px;
            margin-top: 9.5px;
            "></op-button><input v-model="password" type="password" class="form-control" placeholder="Password" data-op-id="2">
                    </div>
                    <div class="input-group mb-4">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="icon-lock"></i></span>
                        </div>
                        <op-button data-op-target="3" data-state="locked" style="
            margin-left: 418px;
            margin-top: 9.5px;
            "></op-button><input v-model="repeat_password" type="password" class="form-control" placeholder="Repeat password" data-op-id="3">
                    </div>
                    <button type="button" class="btn btn-block btn-success">Create Account</button>
                </div>
                <div class="card-footer p-4">
                    <div class="row">
                        <div class="col-6">
                            <button class="btn btn-block btn-facebook" type="button">
                                <span>facebook</span>
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-block btn-twitter" type="button">
                                <span>twitter</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'register'
}
</script>
