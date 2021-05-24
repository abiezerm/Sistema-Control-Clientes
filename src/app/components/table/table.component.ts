import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/_models/client';
import { ClientService } from 'src/app/_services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  modal: boolean = false;
  clients: Client[];
  client: Client;
  direction: string;
  editBtn: boolean = false;
  constructor(private _clientService: ClientService) {}

  ngOnInit(): void {
    this._clientService.getClients().subscribe((clients) => {
      this.clients = clients;
    });
  }

  onEditClient(id) {
    this.openModal('Edit');
    this.client = this.clients[id];
  }

  onAddDirection() {
    this.client?.directions.push(this.direction);
    this.direction = '';
  }

  onApplyEdit() {
    this._clientService.updateClient(this.client, this.client.id);
    this.modal = false;
  }

  onAddClient() {
    this.client = { fullName: '', email: '', directions: [] };
    this.openModal('AddClient');
  }

  onSaveClient() {
    this._clientService.addClient(this.client);
    this.modal = false;
  }
  onRemoveClient(id) {
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar el cliente?',
      text: 'Recuerda que si lo eliminas esta acción no se podrá deshacer',
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      confirmButtonColor: '#2563EB',
      cancelButtonText: `Cancelar`,
      cancelButtonColor: '#DC2626',
    }).then((result) => {
      if (result.isConfirmed) {
        this._clientService.removeClient(this.clients[id].id);
        Swal.fire('EL cliente ha sido eliminado exitosamente', '', 'success');
      } else {
        Swal.fire('La acción ha sido cancelada', '', 'info');
      }
    });
  }
  openModal(action) {
    this.modal = true;
    this.editBtn = action == 'Edit' ? true : false;
  }

  hideModal() {
    this.modal = false;
  }
}
