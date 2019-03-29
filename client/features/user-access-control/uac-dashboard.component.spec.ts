import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Role, Permission, User, Feature } from './index';
import { DashboardState } from './enums/uac-dashboard-state.enum';
import { UserAccessControlService } from './services/user-access-control.service';
import { UserAccessControlComponent } from './uac-dashboard.component';

describe('UserAccessControlComponent', () => {
  let component: UserAccessControlComponent;
  let fixture: ComponentFixture<UserAccessControlComponent>;
  beforeEach(() => {
    const roleStub = { users: {} };
    const permissionStub = { perm_id: {}, name: {} };
    const userStub = { _id: {} };
    const featureStub = {};
    const dashboardStateStub = {};
    const userAccessControlServiceStub = {
      getViewModel: () => ({ then: () => ({}) }),
      createRole: () => ({ then: () => ({ catch: () => ({}) }) }),
      updateRole: () => ({ then: () => ({ catch: () => ({}) }) }),
      deleteRole: () => ({ then: () => ({ catch: () => ({}) }) }),
      createFeature: () => ({ then: () => ({ catch: () => ({}) }) }),
      updateFeature: () => ({ then: () => ({ catch: () => ({}) }) }),
      deleteFeature: () => ({ then: () => ({ catch: () => ({}) }) }),
      createPermission: () => ({ then: () => ({ catch: () => ({}) }) }),
      modifyPermission: () => ({ then: () => ({ catch: () => ({}) }) }),
      deletePermission: () => ({ then: () => ({ catch: () => ({}) }) }),
      connectRoleWithPermission: () => ({
        then: () => ({ catch: () => ({}) })
      }),
      disconnectRoleFromPermission: () => ({
        then: () => ({ catch: () => ({}) })
      }),
      addUserToRole: () => ({ then: () => ({ catch: () => ({}) }) }),
      removeUserFromRole: () => ({ then: () => ({ catch: () => ({}) }) })
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UserAccessControlComponent],
      providers: [
        { provide: Role, useValue: roleStub },
        { provide: Permission, useValue: permissionStub },
        { provide: User, useValue: userStub },
        { provide: Feature, useValue: featureStub },
        { provide: DashboardState, useValue: dashboardStateStub },
        {
          provide: UserAccessControlService,
          useValue: userAccessControlServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(UserAccessControlComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('dashState defaults to: DashboardState.ShowingRoles', () => {
    expect(component.dashState).toEqual(DashboardState.ShowingRoles);
  });
  it('featuresSelected defaults to: false', () => {
    expect(component.featuresSelected).toEqual(false);
  });
  it('usersSelected defaults to: false', () => {
    expect(component.usersSelected).toEqual(false);
  });
  it('rolesMetadata defaults to: []', () => {
    expect(component.rolesMetadata).toEqual([]);
  });
  it('featuresMetadata defaults to: []', () => {
    expect(component.featuresMetadata).toEqual([]);
  });
  it('usersMetadata defaults to: []', () => {
    expect(component.usersMetadata).toEqual([]);
  });
  it('usersReadOnlyMetadata defaults to: []', () => {
    expect(component.usersReadOnlyMetadata).toEqual([]);
  });
  it('permissionsMetadata defaults to: []', () => {
    expect(component.permissionsMetadata).toEqual([]);
  });
  describe('onToggleRole', () => {
    it('makes expected calls', () => {
      const roleStub: Role = fixture.debugElement.injector.get(Role);
      spyOn(component, 'setState');
      component.onToggleRole(roleStub);
      expect(component.setState).toHaveBeenCalled();
    });
  });
  describe('onCreateRole', () => {
    it('makes expected calls', () => {
      const roleStub: Role = fixture.debugElement.injector.get(Role);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'createRole');
      component.onCreateRole(roleStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.createRole).toHaveBeenCalled();
    });
  });
  describe('onModifyRole', () => {
    it('makes expected calls', () => {
      const roleStub: Role = fixture.debugElement.injector.get(Role);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'updateRole');
      component.onModifyRole(roleStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.updateRole).toHaveBeenCalled();
    });
  });
  describe('onDeleteRole', () => {
    it('makes expected calls', () => {
      const roleStub: Role = fixture.debugElement.injector.get(Role);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setState');
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'deleteRole');
      component.onDeleteRole(roleStub);
      expect(component.setState).toHaveBeenCalled();
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.deleteRole).toHaveBeenCalled();
    });
  });
  describe('toggleFeature', () => {
    it('makes expected calls', () => {
      const featureStub: Feature = fixture.debugElement.injector.get(Feature);
      spyOn(component, 'setState');
      component.toggleFeature(featureStub);
      expect(component.setState).toHaveBeenCalled();
    });
  });
  describe('onCreateFeature', () => {
    it('makes expected calls', () => {
      const featureStub: Feature = fixture.debugElement.injector.get(Feature);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'createFeature');
      component.onCreateFeature(featureStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.createFeature).toHaveBeenCalled();
    });
  });
  describe('onModifyFeature', () => {
    it('makes expected calls', () => {
      const featureStub: Feature = fixture.debugElement.injector.get(Feature);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'updateFeature');
      component.onModifyFeature(featureStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.updateFeature).toHaveBeenCalled();
    });
  });
  describe('onDeleteFeature', () => {
    it('makes expected calls', () => {
      const featureStub: Feature = fixture.debugElement.injector.get(Feature);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'deleteFeature');
      component.onDeleteFeature(featureStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.deleteFeature).toHaveBeenCalled();
    });
  });
  describe('onTogglePermission', () => {
    it('makes expected calls', () => {
      const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
      spyOn(component, 'setState');
      component.onTogglePermission(permissionStub);
      expect(component.setState).toHaveBeenCalled();
    });
  });
  describe('onCreatePermission', () => {
    it('makes expected calls', () => {
      const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'createPermission');
      component.onCreatePermission(permissionStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.createPermission).toHaveBeenCalled();
    });
  });
  describe('onModifyPermission', () => {
    it('makes expected calls', () => {
      const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'modifyPermission');
      component.onModifyPermission(permissionStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.modifyPermission).toHaveBeenCalled();
    });
  });
  describe('onDeletePermission', () => {
    it('makes expected calls', () => {
      const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setState');
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'deletePermission');
      component.onDeletePermission(permissionStub);
      expect(component.setState).toHaveBeenCalled();
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.deletePermission).toHaveBeenCalled();
    });
  });
  describe('onAddPermissionToRole', () => {
    it('makes expected calls', () => {
      const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'connectRoleWithPermission');
      component.onAddPermissionToRole(permissionStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(
        userAccessControlServiceStub.connectRoleWithPermission
      ).toHaveBeenCalled();
    });
  });
  describe('onRemovePermissionFromRole', () => {
    it('makes expected calls', () => {
      const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'disconnectRoleFromPermission');
      component.onRemovePermissionFromRole(permissionStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(
        userAccessControlServiceStub.disconnectRoleFromPermission
      ).toHaveBeenCalled();
    });
  });
  describe('onAddUserToRole', () => {
    it('makes expected calls', () => {
      const userStub: User = fixture.debugElement.injector.get(User);
      const roleStub: Role = fixture.debugElement.injector.get(Role);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'addUserToRole');
      component.onAddUserToRole(userStub, roleStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.addUserToRole).toHaveBeenCalled();
    });
  });
  describe('onRemoveUserFromRole', () => {
    it('makes expected calls', () => {
      const userStub: User = fixture.debugElement.injector.get(User);
      const roleStub: Role = fixture.debugElement.injector.get(Role);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'removeUserFromRole');
      component.onRemoveUserFromRole(userStub, roleStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(
        userAccessControlServiceStub.removeUserFromRole
      ).toHaveBeenCalled();
    });
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setMetaData');
      spyOn(userAccessControlServiceStub, 'getViewModel');
      component.ngOnInit();
      expect(component.setMetaData).toHaveBeenCalled();
      expect(userAccessControlServiceStub.getViewModel).toHaveBeenCalled();
    });
  });
});
