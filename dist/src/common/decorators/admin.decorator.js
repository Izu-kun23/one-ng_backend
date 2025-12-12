"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = Admin;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_guard_1 = require("../guards/admin.guard");
function Admin() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(admin_guard_1.AdminGuard), (0, swagger_1.ApiBearerAuth)());
}
//# sourceMappingURL=admin.decorator.js.map