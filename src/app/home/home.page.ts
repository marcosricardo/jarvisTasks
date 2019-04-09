import { Component } from '@angular/core';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks: any[] = []

  constructor(public alertController: AlertController, private toastController: ToastController, private actionSheetController: ActionSheetController) {
    let tasksJson = localStorage.getItem("tasksDb")
    if (tasksJson != null) {
      this.tasks = JSON.parse(tasksJson)
    }
  }

  async showAdd() {

    const alert = await this.alertController.create({
      header: "Escreva sobre a tarefa!",
      inputs: [
        {
          name: "name",
          type: "text",
          placeholder: "Estudar ionic 4..."
        },
        {
          name: "url",
          type: "url",
          placeholder: "https://ionicframework.com/docs/"
        },
        {
          name: 'date',
          type: 'date',
          min: '2019-04-09',
          max: '2019-12-31'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log("Confirm Cancel");
          }
        }, {
          text: "Ok",
          handler: (form) => {
            console.log(form.name)
            this.addTask(form.name, form.url, form.date)
          }
        }
      ]
    });

    await alert.present();
  }

  async addTask(name: string, url: string, date: string) {
    console.log("Task enviada para ser adicionada  ", name, url, date)

    //valida se o usuário preencheu todos os campos.
    if (name && url && date) {
      let task = { name: name, url: url, date: date, done: false }

      this.tasks.push(task)

      this.updateLocalStorage()

      //sucesso
      const toast = await this.toastController.create({
        message: "Tarefa salva mestre Marcos.",
        duration: 2000,
        color: "danger"
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: "Preencha todos os campos para adicionar a tarefa.",
        duration: 2000,
        color: "danger"
      });
      toast.present();
    }
  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetController.create({
      header: "O que deseja fazer mestre?",
      buttons: [{
        text: task.done ? "Desmarcar" : "Marcar",
        icon: task.done ? "radio-button-off" : "checkmark-circle",
        handler: () => {
          task.done = !task.done
          this.updateLocalStorage()
        }
      }, {
        text: "Cancelar",
        icon: "close",
        role: "cancel",
        handler: () => {
          console.log("Cancelar clicado.");
        }
      }
      ]
    });
    await actionSheet.present();
  }

  async delete(task: any) {
    this.tasks = this.tasks.filter(taskArray => task != taskArray)
    this.updateLocalStorage()
  }

  updateLocalStorage() {
    localStorage.setItem("tasksDb", JSON.stringify(this.tasks))
  }
}
