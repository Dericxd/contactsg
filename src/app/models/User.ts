export class User {
  id?: number = 0;
  name: string = '';
  last_name: string = '';
  document_type: string = '';
  document_number: string = '';
  email?: string = '';
  username?: string = '';
  password?: string;
  date_in?: Date;
  status?: string;

  // Additional properties from JOIN queries
  usuario_nombre?: string;
  usuario_apellido?: string;
  ci?: string;
  local_phone?: string;
  telefono_local?: string;
  line_id?: number;
  cell_phone?: string;
  telefono_personal?: string;
  ext?: string;
  extension?: string;
  department?: string;
  departamento?: string;
  position?: string;
  cargo?: string;
  posicion?: string;
  place?: string;
  lugar?: string;
}
