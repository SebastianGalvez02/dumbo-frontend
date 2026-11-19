import { CustomerRegistrationForm } from "@/components/CustomerRegistrationForm";
import { Icon } from "@/components/Icon";

export const instant = false;

export default function CustomersPage() {
  return (
    <section className="panel form-panel max-w-2xl" aria-labelledby="customer-registration-heading">
      <div className="panel-heading">
        <h2 id="customer-registration-heading">Nuevo cliente</h2>
        <span className="panel-icon">
          <Icon name="users" />
        </span>
      </div>
      <CustomerRegistrationForm mode="employee" />
    </section>
  );
}
