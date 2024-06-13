const chai = require('chai')
const chaiHttp = require('chai-http')

chai.should();
chai.use(chaiHttp);

const Todo = require('../models/Todo')
const app = require('../app')

describe('todos', function () {
    // scenario: diakhir bersihin data yang telah ditambahkan
    after(function (done) {
        Todo.deleteMany({ title: /#pengujian#/ }).then(() => {
            done()
        })

    });

    it('seharusnya manambahkan data todo dengan method POST', function (done) {
        chai.request(app).post('/todos').send({
            title: '#pengujian#Makan baso',
            executor: '6669b3bf096ded3a22324446'
        }).end(function (err, res) {
            if (err) throw new Error('gagal melakukan pengetesan create Todo')
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('title');
            res.body.should.have.property('complete');
            res.body.should.have.property('executor');
            res.body.title.should.equal('#pengujian#Makan baso');
            res.body.complete.should.equal(false);
            res.body.executor.should.equal('6669b3bf096ded3a22324446');
            done()
        })
    })

    it('seharusnya mendapatkan semua todo dengan method GET', function (done) {
        chai.request(app).get('/todos?executor=6669b3bf096ded3a22324446').end(function (err, res) {
            if (err) throw new Error('gagal melakukan pengetesan GET All Todos')
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.todos.should.be.a('array');
            res.body.todos[res.body.todos.length - 1].should.be.a('object');
            res.body.todos[res.body.todos.length - 1].should.have.property('_id');
            res.body.todos[res.body.todos.length - 1].should.have.property('title');
            res.body.todos[res.body.todos.length - 1].should.have.property('complete');
            res.body.todos[res.body.todos.length - 1].should.have.property('executor');
            res.body.todos[res.body.todos.length - 1].title.should.equal('#pengujian#Makan baso');
            done()
        })
    })

    it('seharusnya merubah data todo dengan method PUT', function (done) {
        chai.request(app).get('/todos?executor=6669b3bf096ded3a22324446').end(function (error, response) {
            if (error) throw new Error('gagal melakukan pengetesan GET All Todos for update')
            chai.request(app).put(`/todos/${response.body.todos[response.body.todos.length - 1]._id}`).send({
                title: '#pengujian# Update Makan baso',
                complete: true
            }).end(function (err, res) {
                if (err) throw new Error('gagal melakukan pengetesan update Todo')
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('title');
                res.body.should.have.property('complete');
                res.body.should.have.property('executor');
                res.body.title.should.equal('#pengujian# Update Makan baso');
                res.body.complete.should.equal(true);
                res.body.executor.should.equal('6669b3bf096ded3a22324446');
                done()
            });
        })
    })

    it('seharusnya menghapus data todo dengan method DELETE', function (done) {
        chai.request(app).get('/todos?executor=6669b3bf096ded3a22324446').end(function (error, response) {
            if (error) throw new Error('gagal melakukan pengetesan GET All Todos for update')
            chai.request(app).delete(`/todos/${response.body.todos[response.body.todos.length - 1]._id}`).end(function (err, res) {
                if (err) throw new Error('gagal melakukan pengetesan update Todo')
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('title');
                res.body.should.have.property('complete');
                res.body.should.have.property('executor');
                res.body.title.should.equal('#pengujian# Update Makan baso');
                res.body.complete.should.equal(true);
                res.body.executor.should.equal('6669b3bf096ded3a22324446');
                done()
            });
        })
    })

})

