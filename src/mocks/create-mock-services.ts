import type { Services } from "@/services";
import { ServiceError } from "@/services/contracts/service-error";

import type { Role } from "@/types/role";
import type { Session } from "@/types/session";
import type {
  Customer,
  Employee,
  UserContact,
} from "@/types/users";
import type {
  CreateProductInput,
  ImportProductsResult,
  Product,
} from "@/types/product";

import {
  getImportRows,
  initialAccounts,
  initialProducts,
  type MockAccount,
} from "./mock-data";

interface MockOptions {
  emptyEmployees?: boolean;
  emptyCustomers?: boolean;
  emptyProducts?: boolean;
}

const passwordError =
  "La nueva contraseña no cumple los estándares de seguridad";

export function createMockServices(
  options: MockOptions = {},
) {
  const accounts = structuredClone(initialAccounts).filter(
    (account) =>
      !(options.emptyEmployees && account.role === "Trabajador") &&
      !(options.emptyCustomers && account.role === "Cliente"),
  );

  const products = options.emptyProducts
    ? []
    : structuredClone(initialProducts);

  const sessions = new Map<string, Session>();

  const resetTokens = new Map<
    string,
    { accountId: number; expiresAt: number }
  >();

  let nextAccountId =
    Math.max(0, ...accounts.map((account) => account.id)) + 1;

  let nextProductId =
    Math.max(0, ...products.map((product) => product.id)) + 1;

  let activeToken: string | null = null;
  let nextFailure: string | null = null;

  function beforeOperation() {
    if (nextFailure !== null) {
      const message = nextFailure;
      nextFailure = null;

      throw new ServiceError("UNAVAILABLE", message);
    }
  }

  function accountFromToken(token: string): MockAccount {
    const session = sessions.get(token);

    if (
      !session ||
      Date.parse(session.tokenExpiration) <= Date.now()
    ) {
      throw new ServiceError(
        "UNAUTHORIZED",
        "La sesión no es válida o ha expirado.",
      );
    }

    const account = accounts.find(
      (item) => item.id === session.id,
    );

    if (!account || !account.isEnabled) {
      throw new ServiceError(
        "ACCOUNT_DISABLED",
        "Usuario deshabilitado",
      );
    }

    return account;
  }

  function requireRole(role: Role) {
    if (!activeToken) return;

    const account = accountFromToken(activeToken);

    if (account.hasToChangePassword) {
      throw new ServiceError(
        "PASSWORD_CHANGE_REQUIRED",
        "Debes cambiar tu contraseña inicial.",
      );
    }

    if (account.role !== role) {
      throw new ServiceError(
        "FORBIDDEN",
        "No tienes permisos para realizar esta operación.",
      );
    }
  }

  function invalidateSessions(accountId: number) {
    for (const [token, session] of sessions) {
      if (session.id === accountId) {
        sessions.delete(token);

        if (activeToken === token) {
          activeToken = null;
        }
      }
    }
  }

  function readContact(input: UserContact): UserContact {
    const contact = {
      name: input.name.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone.trim(),
      mail: input.mail.trim().toLowerCase(),
    };

    if (
      Object.values(contact).some(
        (value) => value.length === 0,
      )
    ) {
      throw new ServiceError(
        "VALIDATION",
        "Completa todos los campos obligatorios.",
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.mail)) {
      throw new ServiceError(
        "VALIDATION",
        "El correo electrónico no es válido.",
      );
    }

    return contact;
  }

  function assertUniqueMail(
    mail: string,
    excludedId?: number,
  ) {
    const exists = accounts.some(
      (account) =>
        account.mail === mail &&
        account.id !== excludedId,
    );

    if (exists) {
      throw new ServiceError(
        "DUPLICATE_MAIL",
        "El correo electrónico ya está registrado.",
      );
    }
  }

  function initialPassword(contact: UserContact) {
    return (contact.name + contact.lastName)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "")
      .toLowerCase();
  }

  function validatePassword(password: string) {
    if (
      password.length <= 8 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      throw new ServiceError(
        "VALIDATION",
        passwordError,
      );
    }
  }

  function toCustomer(
    account: MockAccount,
  ): Customer {
    return {
      id: account.id,
      name: account.name,
      lastName: account.lastName,
      phone: account.phone,
      mail: account.mail,
      role: "Cliente",
      isEnabled: account.isEnabled,
    };
  }

  function toEmployee(
    account: MockAccount,
  ): Employee {
    return {
      id: account.id,
      name: account.name,
      lastName: account.lastName,
      phone: account.phone,
      mail: account.mail,
      role: "Trabajador",
      isEnabled: account.isEnabled,
    };
  }

  function createAccount(
    input: UserContact,
    role: "Cliente" | "Trabajador",
  ) {
    const contact = readContact(input);

    assertUniqueMail(contact.mail);

    const account: MockAccount = {
      ...contact,
      id: nextAccountId++,
      role,
      isEnabled: true,
      password: initialPassword(contact),
      hasToChangePassword: true,
    };

    accounts.push(account);

    return account;
  }

  function findEmployee(id: number) {
    const employee = accounts.find(
      (account) =>
        account.id === id &&
        account.role === "Trabajador",
    );

    if (!employee) {
      throw new ServiceError(
        "NOT_FOUND",
        "El trabajador no existe.",
      );
    }

    return employee;
  }

  function productErrors(
    input: CreateProductInput,
  ) {
    const errors: string[] = [];

    const requiredFields = [
      input.code,
      input.name,
      input.description,
      input.category,
      input.brand,
    ];

    if (
      requiredFields.some(
        (value) => !value.trim(),
      )
    ) {
      errors.push(
        "Completa todos los campos obligatorios.",
      );
    }

    if (
      !Number.isFinite(input.price) ||
      input.price < 0
    ) {
      errors.push(
        "El precio debe ser un número mayor o igual a cero.",
      );
    }

    if (
      !Number.isFinite(input.stock) ||
      input.stock < 0
    ) {
      errors.push(
        "El stock debe ser un número mayor o igual a cero.",
      );
    }

    if (
      products.some(
        (product) =>
          product.code === input.code.trim(),
      )
    ) {
      errors.push(
        "El código del producto ya está registrado.",
      );
    }

    return errors;
  }

  function saveProduct(
    input: CreateProductInput,
    imageUrl: string | null,
  ): Product {
    const errors = productErrors(input);

    if (errors.length) {
      throw new ServiceError(
        "VALIDATION",
        errors.join(" "),
      );
    }

    const product: Product = {
      id: nextProductId++,
      code: input.code.trim(),
      name: input.name.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      price: input.price,
      stock: input.stock,
      brand: input.brand.trim(),
      imageUrl,
    };

    products.push(product);

    return { ...product };
  }

  async function imageToDataUrl(
    file?: File,
  ): Promise<string | null> {
    if (!file) return null;

    if (!file.type.startsWith("image/")) {
      throw new ServiceError(
        "INVALID_FILE",
        "Selecciona un archivo de imagen.",
      );
    }

    const bytes = new Uint8Array(
      await file.arrayBuffer(),
    );

    let binary = "";

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return `data:${file.type};base64,${btoa(binary)}`;
  }

  const services: Services = {
    authentication: {
      async signIn(input) {
        beforeOperation();

        const account = accounts.find(
          (item) =>
            item.mail === input.mail.trim().toLowerCase(),
        );

        if (
          !account ||
          account.password !== input.password
        ) {
          throw new ServiceError(
            "INVALID_CREDENTIALS",
            "Las credenciales de acceso son incorrectas o el usuario no está registrado en el sistema",
          );
        }

        if (!account.isEnabled) {
          throw new ServiceError(
            "ACCOUNT_DISABLED",
            "Usuario deshabilitado",
          );
        }

        const session: Session = {
          id: account.id,
          name: account.name,
          lastName: account.lastName,
          mail: account.mail,
          role: account.role,
          hasToChangePassword:
            account.hasToChangePassword,
          token: crypto.randomUUID(),
          tokenExpiration: new Date(
            Date.now() + 60 * 60 * 1000,
          ).toISOString(),
        };

        sessions.set(session.token, session);
        activeToken = session.token;

        return { ...session };
      },

      async signOut() {
        if (activeToken) {
          sessions.delete(activeToken);
        }

        activeToken = null;
      },

      async changePassword(input, token) {
        beforeOperation();

        const account = accountFromToken(token);

        if (
          account.password !== input.oldPassword
        ) {
          throw new ServiceError(
            "VALIDATION",
            "La contraseña actual es incorrecta.",
          );
        }

        validatePassword(input.newPassword);

        account.password = input.newPassword;
        account.hasToChangePassword = false;

        invalidateSessions(account.id);

        for (
          const [resetToken, request]
          of resetTokens
        ) {
          if (request.accountId === account.id) {
            resetTokens.delete(resetToken);
          }
        }
      },

      async requestPasswordReset(input) {
        beforeOperation();

        const mail = input.mail
          .trim()
          .toLowerCase();

        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
        ) {
          throw new ServiceError(
            "VALIDATION",
            "El correo electrónico no es válido.",
          );
        }

        const account = accounts.find(
          (item) => item.mail === mail,
        );

        if (account) {
          for (
            const [token, request]
            of resetTokens
          ) {
            if (request.accountId === account.id) {
              resetTokens.delete(token);
            }
          }

          resetTokens.set(
            crypto.randomUUID(),
            {
              accountId: account.id,
              expiresAt:
                Date.now() + 15 * 60 * 1000,
            },
          );
        }

        return {
          message:
            "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
        };
      },

      async resetPassword(input) {
        beforeOperation();

        const request = resetTokens.get(
          input.token,
        );

        const account = accounts.find(
          (item) =>
            item.mail === input.mail.trim().toLowerCase(),
        );

        if (
          !request ||
          request.expiresAt <= Date.now() ||
          !account ||
          request.accountId !== account.id
        ) {
          throw new ServiceError(
            "INVALID_TOKEN",
            "El enlace de recuperación no es válido o ha expirado.",
          );
        }

        validatePassword(input.newPassword);

        account.password = input.newPassword;
        account.hasToChangePassword = false;

        resetTokens.delete(input.token);
        invalidateSessions(account.id);
      },
    },

    customers: {
      async register(input) {
        beforeOperation();

        return toCustomer(
          createAccount(input, "Cliente"),
        );
      },

      async registerByEmployee(input) {
        beforeOperation();
        requireRole("Trabajador");

        return toCustomer(
          createAccount(input, "Cliente"),
        );
      },
    },

    employees: {
      async list() {
        beforeOperation();
        requireRole("Administrador");

        return accounts
          .filter(
            (account) =>
              account.role === "Trabajador",
          )
          .map(toEmployee);
      },

      async create(input) {
        beforeOperation();
        requireRole("Administrador");

        return toEmployee(
          createAccount(input, "Trabajador"),
        );
      },

      async update(employeeId, input) {
        beforeOperation();
        requireRole("Administrador");

        const account = findEmployee(
          employeeId,
        );

        if (
          Object.values(input).every(
            (value) => value === undefined,
          )
        ) {
          throw new ServiceError(
            "VALIDATION",
            "Debes enviar al menos un campo para actualizar.",
          );
        }

        const contact = readContact({
          name: input.name ?? account.name,
          lastName:
            input.lastName ?? account.lastName,
          phone: input.phone ?? account.phone,
          mail: input.mail ?? account.mail,
        });

        assertUniqueMail(
          contact.mail,
          account.id,
        );

        Object.assign(account, contact);

        return toEmployee(account);
      },

      async changeStatus(
        employeeId,
        input,
      ) {
        beforeOperation();
        requireRole("Administrador");

        if (
          typeof input.isEnabled !== "boolean"
        ) {
          throw new ServiceError(
            "VALIDATION",
            "El estado debe ser verdadero o falso.",
          );
        }

        const account = findEmployee(
          employeeId,
        );

        account.isEnabled = input.isEnabled;

        if (!account.isEnabled) {
          invalidateSessions(account.id);
        }

        return toEmployee(account);
      },
    },

    products: {
      async create(input) {
        beforeOperation();
        requireRole("Trabajador");

        const imageUrl =
          await imageToDataUrl(input.image);

        requireRole("Trabajador");

        return saveProduct(input, imageUrl);
      },

      async importProducts(input) {
        beforeOperation();
        requireRole("Trabajador");

        const rows = getImportRows(
          input.file.name,
        );

        const result: ImportProductsResult = {
          createdProducts: [],
          rejectedRows: [],
        };

        rows.forEach((row, index) => {
          const errors = productErrors(row);

          if (errors.length) {
            result.rejectedRows.push({
              rowNumber: index + 2,
              code: row.code || undefined,
              messages: errors,
            });
          } else {
            result.createdProducts.push(
              saveProduct(row, null),
            );
          }
        });

        return result;
      },
    },
  };

  const controls = {
    failNext(
      message =
        "No se pudo conectar con el servidor. Intenta nuevamente.",
    ) {
      nextFailure = message;
    },

    getResetLink(
      mail: string,
    ): string | null {
      const account = accounts.find(
        (item) =>
          item.mail === mail.trim().toLowerCase(),
      );

      if (!account) return null;

      for (
        const [token, request]
        of resetTokens
      ) {
        if (
          request.accountId === account.id &&
          request.expiresAt > Date.now()
        ) {
          return `/restablecer-contrasena?correo=${encodeURIComponent(account.mail)}&token=${encodeURIComponent(token)}`;
        }
      }

      return null;
    },

    expireSession(token: string) {
      const session = sessions.get(token);

      if (session) {
        session.tokenExpiration =
          new Date(0).toISOString();
      }
    },

    expireResetTokens() {
      for (
        const request
        of resetTokens.values()
      ) {
        request.expiresAt = 0;
      }
    },
  };

  return { services, controls };
}