/**
 *  @title joola.io
 *  @overview the open-source data analytics framework
 *  @copyright Joola Smart Solutions, Ltd. <info@joo.la>
 *  @license GPL-3.0+ <http://spdx.org/licenses/GPL-3.0+>
 *
 *  Licensed under GNU General Public License 3.0 or later.
 *  Some rights reserved. See LICENSE, AUTHORS.
 **/


describe("sdk-datasources", function () {
  it("should return a valid list of data sources", function (done) {
    _sdk.dispatch.datasources.list(function (err, datasources) {
      return done(err);
    });
  });

  it("should add a data source", function () {
    _sdk.dispatch.datasources.add({name: 'testSuite-sdk', type: 'test', _connectionString: 'test'}, function (err, datasource) {
      return expect(datasource).to.be.ok;
    });
  });

  it("should update a data source", function () {
    _sdk.dispatch.datasources.update({name: 'testSuite-sdk', type: 'test2', _connectionString: 'test'}, function (err, datasource) {
      return expect(datasource.type).to.equal('test2');
    });
  });

  it("should delete a data source", function (done) {
    _sdk.dispatch.datasources.delete({name: 'testSuite'}, function (err) {
      _sdk.dispatch.datasources.list(function (err, datasources) {
        var exist = _.filter(datasources, function (item) {
          return item.name == 'testSuite';
        });
        try {
          expect(exist.length).to.equal(0);
          done();
        }
        catch (ex) {
          done(ex);
        }
      })
    });
  });
});